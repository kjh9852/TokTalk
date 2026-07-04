import styles from "./Pagination.module.css";

export default function Pagination({ currentPage, totalPage, onPageClick }) {
  return (
    <div className={styles.container}>
      <ul className={styles.pageContainer}>
        {Array.from({ length: totalPage }, (_, index) => {
          const page = index + 1;
          return (
            <li key={index} className={styles.pageList}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPageClick(page);
                }}
                className={`${styles.pageNumber} ${
                  currentPage === page && styles.activePage
                }`}
                disabled={currentPage === page}
              >
                {page}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
