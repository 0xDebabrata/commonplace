import NewCardButton from '../components/NewCardButton'
import ProtectedRoute from '../components/ProtectedRoute'

import styles from '../styles/Home.module.css'

export default function Home() {

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <h1>Hello world</h1>
                <NewCardButton />
            </div>
        </ProtectedRoute>
  )
}
