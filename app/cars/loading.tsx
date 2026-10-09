import { CarCardSkeleton } from "@/components/cars/CarCardSkeleton";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

import styles from "./loading.module.css";

export default function CarsLoading() {
  return (
    <main id="main-content" aria-busy="true" aria-label="Loading available cars">
      <section className={styles.heading}>
        <div className={`container ${styles.headingInner}`}>
          <div>
            <p className="eyebrow">Current inventory</p>
            <h1 className="displayTitle">Available Cars</h1>
            <p className={styles.intro}>Explore quality vehicles available through JK_AUTOS in Kaduna.</p>
          </div>
          <SkeletonBlock className={styles.countBar} />
        </div>
      </section>

      <section className={styles.catalogue}>
        <div className={`container ${styles.layout}`}>
          <div className={styles.filters}>
            <SkeletonBlock className={styles.filterPanel} />
          </div>
          <div className={styles.results}>
            <div className={styles.toolbar}>
              <SkeletonBlock className={styles.toolbarLeft} />
              <SkeletonBlock className={styles.toolbarRight} />
            </div>
            <div className={styles.grid}>
              {Array.from({ length: 4 }, (_, index) => <CarCardSkeleton key={index} />)}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
