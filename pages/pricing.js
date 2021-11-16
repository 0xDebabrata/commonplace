import supabase from '../utils/supabaseClient'

import styles from '../styles/pricing.module.css'

const Pricing = () => {

    const signIn = async () => {
        const { error } = await supabase.auth.signIn({ provider: "google" }, { redirectTo: `${process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL}` })
        if (error) {
            console.log(error)
        }
    }

    return(
        <div className={styles.container}>
            <h2 className={styles.title}>Pricing</h2>
            <div className={styles.block}>
                <h1><span>₹</span>399</h1>
                <p className={styles.sub}>One time fee</p>
                <div>
                    <div className={styles.icon} />
                    <p className={styles.feature}>Full access to commonplace</p>
                </div>
                <button
                    onClick={signIn}
                >
                    Get access
                </button>
            </div>
        </div>
    )
}

export default Pricing 
