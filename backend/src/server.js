import app from './app.js';
import { connectDB, closeDB } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { User } from './modules/users/user.model.js';
import { ROLES, APPROVAL_STATUS } from './constants/index.js';

let server;

// Helper to seed initial demo accounts if DB is empty
const seedDemoAccountsIfEmpty = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      logger.info('Database is empty. Seeding initial demo roles (Admin, Manager, Employee)...');

      const admin = await User.create({
        name: 'System Admin',
        email: 'admin@ams.com',
        password: 'Password123!',
        role: ROLES.ADMIN,
        department: 'Executive Administration',
        approvalStatus: APPROVAL_STATUS.APPROVED,
        isActive: true
      });

      const manager = await User.create({
        name: 'Alex Rivera (Operations Manager)',
        email: 'manager@ams.com',
        password: 'Password123!',
        role: ROLES.MANAGER,
        department: 'Operations',
        managerId: admin._id,
        approvalStatus: APPROVAL_STATUS.APPROVED,
        isActive: true
      });

      await User.create({
        name: 'Jane Doe (Field Engineer)',
        email: 'employee@ams.com',
        password: 'Password123!',
        role: ROLES.EMPLOYEE,
        department: 'Field Engineering',
        managerId: manager._id,
        approvalStatus: APPROVAL_STATUS.APPROVED,
        isActive: true
      });

      logger.info('✅ Demo accounts seeded successfully:');
      logger.info('   Admin:    admin@ams.com / Password123!');
      logger.info('   Manager:  manager@ams.com / Password123!');
      logger.info('   Employee: employee@ams.com / Password123!');
    }
  } catch (error) {
    logger.warn(`Demo seed check skipped or failed: ${error.message}`);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await seedDemoAccountsIfEmpty();

    server = app.listen(env.PORT, () => {
      logger.info(`🚀 AMS Backend Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      logger.info(`📡 Client Origin allowed: ${env.CLIENT_URL}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      await closeDB();
      logger.info('Process terminated safely');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
