import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from "./components/Layout";

export default function Home() {
    return (
        <Layout>
            <div className={styles.container}>

                <main className={styles.main}>
                    <h1 className={styles.title}>
                        Welcome to <a href="http://localhost:3000">graph.ds!</a>
                    </h1>

                    <p className={styles.description}>
                        Get started with the <a href="http://localhost:3000/editor">visualizer</a>.
                        {/*<code className={styles.code}>pages/index.js</code>*/}
                    </p>

                    <div className={styles.grid}>
                        <a href="http://localhost:3000/docs" className={styles.card}>
                            <h2>Documentation &rarr;</h2>
                            <p>Find in-depth information about the graph.ds API</p>
                        </a>

                        <a href="http://localhost:3000/learn" className={styles.card}>
                            <h2>Learn &rarr;</h2>
                            <p>Learn how to use graph.ds to explore graphs</p>
                        </a>

                        <a
                            href="http://localhost:3000/examples"
                            className={styles.card}
                        >
                            <h2>Examples &rarr;</h2>
                            <p>Explore interesting and famous graphs</p>
                        </a>

                        <a
                            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                            className={styles.card}
                        >
                            <h2>About &rarr;</h2>
                            <p>
                                Learn more about graph.ds and its wonderful developer
                            </p>
                        </a>
                    </div>
                </main>

                <footer className={styles.footer}>
                    <a
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Powered by{' '}
                        <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16}/>
          </span>
                    </a>
                </footer>
            </div>
        </Layout>
    )
}
