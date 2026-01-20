import { motion } from 'framer-motion';

export default function SectionTitle({ title, subtitle, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[#007A8C]/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-[#007A8C]" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-[#00353F]">{title}</h2>
          {subtitle && (
            <p className="text-sm text-[#00353F]/60 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
