import { Listbox } from "@headlessui/react"
import Image from "next/image"

import styles from "../../styles/payment.module.css"

const currencies = [
  { value: 'USD', label: 'USD', key: 1 },
  { value: 'INR', label: 'INR', key: 2 },
]

export default function Dropdown({ currency, setCurrency }) {
  return (
    <div className={styles.dropdownContainer}>
      <Listbox value={currency} onChange={setCurrency}>
        <Listbox.Button className={styles.dropdownButton}>
          {currency.value}
          <Image
            src="/chevron-down.svg"
            alt="arrow-icon"
            width={24}
            height={24}
            className={styles.dropdownIcon}
          />
        </Listbox.Button>
        <Listbox.Options className={styles.dropdown}>
          {currencies.map((currency) => (
            <Listbox.Option
              className={styles.dropdownOption}
              key={currency.key}
              value={currency}
            >
              {currency.label}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  )
}
