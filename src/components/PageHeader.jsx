import { motion } from 'framer-motion';

export default function PageHeader({ title, subtitle, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center gap-4 mb-3">
        {Icon && (
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00353F] to-[#007A8C] flex items-center justify-center shadow-lg shadow-[#007A8C]/20">
            <Icon className="w-7 h-7 text-white" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-[#00353F]">{title}</h1>
          {subtitle && (
            <p className="text-[#00353F]/60 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
