const express = require("express");
const Shipment = require("../models/Shipment");
const Driver = require("../models/Driver");
const jwt = require("jsonwebtoken");

const router = express.Router();

// JWT auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Admin check middleware
async function adminOnly(req, res, next) {
  const User = require("../models/User");
  const user = await User.findById(req.user.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

// GET /api/analytics - get basic analytics
router.get("/", auth, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.userId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    let shipments;
    if (user.role === "admin") {
      shipments = await Shipment.find({}); // All shipments for admin
    } else {
      shipments = await Shipment.find({ user: req.user.userId });
    }
    const deliveredThisMonth = shipments.filter(
      (s) =>
        s.status === "Delivered" &&
        s.estimatedDelivery &&
        new Date(s.estimatedDelivery) >= startOfMonth
    ).length;
    const delivered = shipments.filter(
      (s) => s.status === "Delivered" && s.estimatedDelivery
    );
    const avgDeliveryTime = delivered.length
      ? (
          delivered.reduce(
            (sum, s) => sum + (new Date(s.estimatedDelivery) - s.createdAt),
            0
          ) /
          delivered.length /
          (1000 * 60 * 60 * 24)
        ).toFixed(1)
      : 0;
    const missedDeliveries = shipments.filter(
      (s) =>
        s.status !== "Delivered" &&
        s.estimatedDelivery &&
        new Date(s.estimatedDelivery) < now
    ).length;
    const regions = [
      ...new Set(
        shipments
          .map(
            (s) =>
              s.recipient &&
              (s.recipient.country ||
                s.recipient.name ||
                s.recipient.toString())
          )
          .filter(Boolean)
      ),
    ];
    res.json({
      deliveredThisMonth,
      avgDeliveryTime,
      missedDeliveries,
      regions,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/analytics/on-time-delivery - calculate on-time delivery rate
router.get("/on-time-delivery", auth, adminOnly, async (req, res) => {
  try {
    const shipments = await Shipment.find({ status: "Delivered" });
    let onTimeCount = 0;
    let totalDelivered = 0;

    shipments.forEach((shipment) => {
      if (shipment.estimatedDelivery && shipment.actualDelivery) {
        totalDelivered++;
        const estimated = new Date(shipment.estimatedDelivery);
        const actual = new Date(shipment.actualDelivery);
        if (actual <= estimated) {
          onTimeCount++;
        }
      }
    });

    const onTimeRate =
      totalDelivered > 0
        ? ((onTimeCount / totalDelivered) * 100).toFixed(1)
        : 0;

    res.json({
      onTimeRate: parseFloat(onTimeRate),
      onTimeCount,
      totalDelivered,
      lateCount: totalDelivered - onTimeCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/analytics/most-used-routes - analyze popular delivery routes
router.get("/most-used-routes", auth, adminOnly, async (req, res) => {
  try {
    const shipments = await Shipment.find({});
    const routeMap = new Map();

    shipments.forEach((shipment) => {
      if (shipment.sender && shipment.recipient) {
        const senderCity =
          shipment.sender.city ||
          shipment.sender.address?.split(",")[0] ||
          "Unknown";
        const recipientCity =
          shipment.recipient.city ||
          shipment.recipient.address?.split(",")[0] ||
          "Unknown";
        const route = `${senderCity} → ${recipientCity}`;

        if (!routeMap.has(route)) {
          routeMap.set(route, {
            route,
            count: 0,
            avgDeliveryTime: 0,
            totalDeliveryTime: 0,
            deliveredCount: 0,
          });
        }

        const routeData = routeMap.get(route);
        routeData.count++;

        if (
          shipment.status === "Delivered" &&
          shipment.estimatedDelivery &&
          shipment.createdAt
        ) {
          routeData.deliveredCount++;
          const deliveryTime =
            (new Date(shipment.estimatedDelivery) -
              new Date(shipment.createdAt)) /
            (1000 * 60 * 60 * 24);
          routeData.totalDeliveryTime += deliveryTime;
        }
      }
    });

    // Calculate average delivery times
    routeMap.forEach((routeData) => {
      if (routeData.deliveredCount > 0) {
        routeData.avgDeliveryTime = (
          routeData.totalDeliveryTime / routeData.deliveredCount
        ).toFixed(1);
      }
    });

    // Sort by count and return top 10
    const routes = Array.from(routeMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/analytics/problematic-zones - identify delay-prone areas
router.get("/problematic-zones", auth, adminOnly, async (req, res) => {
  try {
    const shipments = await Shipment.find({});
    const zoneMap = new Map();

    shipments.forEach((shipment) => {
      if (shipment.recipient) {
        const zone =
          shipment.recipient.city ||
          shipment.recipient.address?.split(",")[0] ||
          "Unknown";

        if (!zoneMap.has(zone)) {
          zoneMap.set(zone, {
            zone,
            totalShipments: 0,
            delayedShipments: 0,
            avgDelay: 0,
            totalDelay: 0,
            delayCount: 0,
          });
        }

        const zoneData = zoneMap.get(zone);
        zoneData.totalShipments++;

        if (
          shipment.status === "Delivered" &&
          shipment.estimatedDelivery &&
          shipment.actualDelivery
        ) {
          const estimated = new Date(shipment.estimatedDelivery);
          const actual = new Date(shipment.actualDelivery);

          if (actual > estimated) {
            zoneData.delayedShipments++;
            zoneData.delayCount++;
            const delayDays = (actual - estimated) / (1000 * 60 * 60 * 24);
            zoneData.totalDelay += delayDays;
          }
        }
      }
    });

    // Calculate delay rates and average delays
    zoneMap.forEach((zoneData) => {
      zoneData.delayRate =
        zoneData.totalShipments > 0
          ? (
              (zoneData.delayedShipments / zoneData.totalShipments) *
              100
            ).toFixed(1)
          : 0;
      zoneData.avgDelay =
        zoneData.delayCount > 0
          ? (zoneData.totalDelay / zoneData.delayCount).toFixed(1)
          : 0;
    });

    // Sort by delay rate and return top 10
    const zones = Array.from(zoneMap.values())
      .filter((zone) => parseFloat(zone.delayRate) > 0)
      .sort((a, b) => parseFloat(b.delayRate) - parseFloat(a.delayRate))
      .slice(0, 10);

    res.json(zones);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/analytics/monthly-trends - monthly shipment trends
router.get("/monthly-trends", auth, adminOnly, async (req, res) => {
  try {
    const shipments = await Shipment.find({});
    const monthlyData = new Map();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Initialize last 12 months
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
      monthlyData.set(monthKey, {
        month: monthKey,
        shipments: 0,
        delivered: 0,
        inTransit: 0,
        pending: 0,
      });
    }

    // Count shipments by month
    shipments.forEach((shipment) => {
      const createdDate = new Date(shipment.createdAt);
      const monthKey = `${
        months[createdDate.getMonth()]
      } ${createdDate.getFullYear()}`;

      if (monthlyData.has(monthKey)) {
        const monthData = monthlyData.get(monthKey);
        monthData.shipments++;

        switch (shipment.status) {
          case "Delivered":
            monthData.delivered++;
            break;
          case "In Transit":
            monthData.inTransit++;
            break;
          case "Pending Pickup":
            monthData.pending++;
            break;
        }
      }
    });

    const trends = Array.from(monthlyData.values());
    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/analytics/delivery-status-distribution - delivery status breakdown
router.get(
  "/delivery-status-distribution",
  auth,
  adminOnly,
  async (req, res) => {
    try {
      const shipments = await Shipment.find({});
      const statusCount = {
        Delivered: 0,
        "In Transit": 0,
        "Pending Pickup": 0,
        Cancelled: 0,
      };

      shipments.forEach((shipment) => {
        if (statusCount.hasOwnProperty(shipment.status)) {
          statusCount[shipment.status]++;
        }
      });

      const total = shipments.length;
      const distribution = Object.entries(statusCount).map(
        ([status, count]) => ({
          status,
          count,
          percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
        })
      );

      res.json(distribution);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /api/analytics/driver-performance - driver performance metrics
router.get("/driver-performance", auth, adminOnly, async (req, res) => {
  try {
    const drivers = await Driver.find({ isActive: true });
    const shipments = await Shipment.find({});

    const driverPerformance = drivers.map((driver) => {
      const driverShipments = shipments.filter((s) =>
        driver.assignedShipments.includes(s.trackingNumber)
      );

      const delivered = driverShipments.filter(
        (s) => s.status === "Delivered"
      ).length;
      const total = driverShipments.length;
      const deliveryRate =
        total > 0 ? ((delivered / total) * 100).toFixed(1) : 0;

      return {
        driverId: driver._id,
        driverName: driver.name,
        totalAssignments: total,
        deliveredCount: delivered,
        deliveryRate: parseFloat(deliveryRate),
        avgRating: driver.performance?.averageRating || 0,
        totalEarnings: driver.performance?.totalEarnings || 0,
        status: driver.status,
      };
    });

    // Sort by delivery rate
    driverPerformance.sort((a, b) => b.deliveryRate - a.deliveryRate);

    res.json(driverPerformance);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/analytics/comprehensive - get all analytics data in one call
router.get("/comprehensive", auth, adminOnly, async (req, res) => {
  try {
    const [
      basicAnalytics,
      onTimeDelivery,
      mostUsedRoutes,
      problematicZones,
      monthlyTrends,
      statusDistribution,
      driverPerformance,
    ] = await Promise.all([
      // Basic analytics
      (async () => {
        const shipments = await Shipment.find({});
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const deliveredThisMonth = shipments.filter(
          (s) =>
            s.status === "Delivered" &&
            s.estimatedDelivery &&
            new Date(s.estimatedDelivery) >= startOfMonth
        ).length;

        const delivered = shipments.filter(
          (s) => s.status === "Delivered" && s.estimatedDelivery
        );
        const avgDeliveryTime = delivered.length
          ? (
              delivered.reduce(
                (sum, s) => sum + (new Date(s.estimatedDelivery) - s.createdAt),
                0
              ) /
              delivered.length /
              (1000 * 60 * 60 * 24)
            ).toFixed(1)
          : 0;

        const missedDeliveries = shipments.filter(
          (s) =>
            s.status !== "Delivered" &&
            s.estimatedDelivery &&
            new Date(s.estimatedDelivery) < now
        ).length;

        return { deliveredThisMonth, avgDeliveryTime, missedDeliveries };
      })(),

      // On-time delivery
      (async () => {
        const shipments = await Shipment.find({ status: "Delivered" });
        let onTimeCount = 0,
          totalDelivered = 0;

        shipments.forEach((s) => {
          if (s.estimatedDelivery && s.actualDelivery) {
            totalDelivered++;
            if (new Date(s.actualDelivery) <= new Date(s.estimatedDelivery)) {
              onTimeCount++;
            }
          }
        });

        return {
          onTimeRate:
            totalDelivered > 0
              ? ((onTimeCount / totalDelivered) * 100).toFixed(1)
              : 0,
          onTimeCount,
          totalDelivered,
          lateCount: totalDelivered - onTimeCount,
        };
      })(),

      // Most used routes (simplified)
      (async () => {
        const shipments = await Shipment.find({});
        const routeMap = new Map();

        shipments.forEach((s) => {
          if (s.sender && s.recipient) {
            const senderCity =
              s.sender.city || s.sender.address?.split(",")[0] || "Unknown";
            const recipientCity =
              s.recipient.city ||
              s.recipient.address?.split(",")[0] ||
              "Unknown";
            const route = `${senderCity} → ${recipientCity}`;

            routeMap.set(route, (routeMap.get(route) || 0) + 1);
          }
        });

        return Array.from(routeMap.entries())
          .map(([route, count]) => ({ route, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
      })(),

      // Problematic zones (simplified)
      (async () => {
        const shipments = await Shipment.find({});
        const zoneMap = new Map();

        shipments.forEach((s) => {
          if (s.recipient) {
            const zone =
              s.recipient.city ||
              s.recipient.address?.split(",")[0] ||
              "Unknown";
            const current = zoneMap.get(zone) || { zone, total: 0, delayed: 0 };
            current.total++;
            if (
              s.status !== "Delivered" &&
              s.estimatedDelivery &&
              new Date(s.estimatedDelivery) < new Date()
            ) {
              current.delayed++;
            }
            zoneMap.set(zone, current);
          }
        });

        return Array.from(zoneMap.values())
          .map((zone) => ({
            ...zone,
            delayRate:
              zone.total > 0
                ? ((zone.delayed / zone.total) * 100).toFixed(1)
                : 0,
          }))
          .filter((zone) => parseFloat(zone.delayRate) > 0)
          .sort((a, b) => parseFloat(b.delayRate) - parseFloat(a.delayRate))
          .slice(0, 5);
      })(),

      // Monthly trends (simplified)
      (async () => {
        const shipments = await Shipment.find({});
        const monthlyData = new Map();
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
          monthlyData.set(monthKey, {
            month: monthKey,
            shipments: 0,
            delivered: 0,
          });
        }

        shipments.forEach((s) => {
          const createdDate = new Date(s.createdAt);
          const monthKey = `${
            months[createdDate.getMonth()]
          } ${createdDate.getFullYear()}`;
          if (monthlyData.has(monthKey)) {
            const monthData = monthlyData.get(monthKey);
            monthData.shipments++;
            if (s.status === "Delivered") monthData.delivered++;
          }
        });

        return Array.from(monthlyData.values());
      })(),

      // Status distribution
      (async () => {
        const shipments = await Shipment.find({});
        const statusCount = {
          Delivered: 0,
          "In Transit": 0,
          "Pending Pickup": 0,
        };

        shipments.forEach((s) => {
          if (statusCount.hasOwnProperty(s.status)) {
            statusCount[s.status]++;
          }
        });

        const total = shipments.length;
        return Object.entries(statusCount).map(([status, count]) => ({
          status,
          count,
          percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
        }));
      })(),

      // Driver performance (simplified)
      (async () => {
        const drivers = await Driver.find({ isActive: true });
        return drivers.map((d) => ({
          driverName: d.name,
          totalAssignments: d.assignedShipments.length,
          deliveryRate:
            d.performance?.successfulDeliveries &&
            d.performance?.totalDeliveries
              ? (
                  (d.performance.successfulDeliveries /
                    d.performance.totalDeliveries) *
                  100
                ).toFixed(1)
              : 0,
          avgRating: d.performance?.averageRating || 0,
          status: d.status,
        }));
      })(),
    ]);

    res.json({
      basicAnalytics,
      onTimeDelivery,
      mostUsedRoutes,
      problematicZones,
      monthlyTrends,
      statusDistribution,
      driverPerformance,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
