
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  index?: number;
}

const DashboardCard = ({
  title,
  subtitle,
  value,
  icon,
  footer,
  className,
  onClick,
  index = 0,
}: DashboardCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <div
        onClick={onClick}
        className={cn(
          "bg-white dark:bg-gray-900 rounded-xl p-6 shadow-card transition-all duration-300",
          onClick && "cursor-pointer hover:translate-y-[-2px] hover:shadow-elevation",
          className
        )}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <h3 className={cn(
              "font-medium", 
              subtitle ? "text-base" : "text-lg"
            )}>
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          {icon && (
            <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
              {icon}
            </div>
          )}
        </div>

        {value !== undefined && (
          <div className="mt-4">
            <div className="text-2xl font-semibold">{value}</div>
          </div>
        )}

        {footer && (
          <div className="mt-4 pt-4 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardCard;
