export function LoadingSkeletonResults() {
  return (
    <div className="loading-skeleton">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-bar" style={{ width: '30%', height: '0.75rem' }} />
          <div className="skeleton-avatar" />
          <div className="skeleton-bar primary" style={{ width: '50%', height: '1rem' }} />
          <div>
            <div
              className="skeleton-bar"
              style={{ marginBottom: '0.25rem', width: '100%', height: '0.75rem' }}
            />
            <div className="skeleton-bar" style={{ width: '65%', height: '0.75rem' }} />
          </div>
          <div className="row" style={{ paddingTop: '0.25rem' }}>
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className={'skeleton-bar ' + (index === 0 ? 'primary' : '')}
                style={{ marginRight: '0.5rem', width: '20%', height: '0.75rem' }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
