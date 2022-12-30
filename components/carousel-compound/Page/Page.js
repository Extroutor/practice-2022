import { useContext } from 'react'
import { CarouselContext } from '../carousel-context'
import st from '../../../styles/mainPage.module.scss'

export const Page = ({ children }) => {
  const { width } = useContext(CarouselContext)
  return (
    <div
      className={st.page_main__container}
      style={{
        minWidth: `${width}px`,
        maxWidth: `${width}px`,
      }}
    >
      {children}
    </div>
  )
}
