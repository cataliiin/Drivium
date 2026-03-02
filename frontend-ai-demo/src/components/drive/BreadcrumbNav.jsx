export default function BreadcrumbNav({ path = [], onNavigate }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumb mb-0">
        {path.map((item, index) => {
          const isLast = index === path.length - 1;
          return (
            <li key={`${item.id ?? "root"}-${index}`} className={`breadcrumb-item ${isLast ? "active" : ""}`}>
              {isLast ? (
                item.name
              ) : (
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => onNavigate(item.id)}
                >
                  {item.name}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
