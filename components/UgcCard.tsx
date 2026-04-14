import Link from 'next/link'
import { UgcItem } from '@/lib/types'

export default function UgcCard({ item, compact }: { item: UgcItem; compact?: boolean }) {
  return (
    <Link href={`/restaurant/${item.restaurantSlug}`} className={`ugc-card ${compact ? 'ugc-compact' : ''}`}>
      <div className="ugc-thumb-wrap">
        <img src={item.thumbnail} alt={item.caption} className="ugc-thumb" />
        {item.type === 'video' && (
          <>
            <div className="play-badge">▶</div>
            {item.duration && <div className="duration-badge">{item.duration}</div>}
          </>
        )}
      </div>
      <div className="ugc-meta">
        <div className="ugc-creator">{item.creator}</div>
        <div className="ugc-restaurant">{item.restaurantName}</div>
        <div className="ugc-likes">♥ {item.likes}</div>
      </div>
    </Link>
  )
}
