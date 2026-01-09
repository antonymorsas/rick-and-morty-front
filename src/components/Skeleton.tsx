import styles from './Skeleton.module.css';

interface SkeletonProps {
  variant?: 'card' | 'text' | 'title' | 'image';
  className?: string;
}

export default function Skeleton({ variant = 'text', className }: SkeletonProps) {
  const skeletonClasses = [
    styles.skeleton,
    variant === 'card' && styles.skeletonCard,
    variant === 'text' && styles.skeletonText,
    variant === 'title' && styles.skeletonTitle,
    variant === 'image' && styles.skeletonImage,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={skeletonClasses} />;
}

interface SkeletonCardProps {
  count?: number;
}

export function SkeletonCard({ count = 1 }: SkeletonCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.skeletonCard}>
          <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
          <div className={`${styles.skeleton} ${styles.skeletonImage}`} />
        </div>
      ))}
    </>
  );
}

interface SkeletonGridProps {
  count?: number;
}

export function SkeletonGrid({ count = 2 }: SkeletonGridProps) {
  return (
    <div className={styles.skeletonGrid}>
      <SkeletonCard count={count} />
    </div>
  );
}

