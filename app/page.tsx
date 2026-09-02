import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Etapa 1</p>
        <h1>IMC calculadora</h1>
        <p className={styles.texto}>
          Base do projeto Next.js em construção. A calculadora ainda será
          portada, mas a aplicação já está rodando como App Router.
        </p>
      </section>
    </main>
  );
}
