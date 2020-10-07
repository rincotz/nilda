import React, {useEffect, useState} from "react"
import ServiceCard from "./ServiceCard"
import CircularProgress from "@material-ui/core/CircularProgress"

export const ServiceCardList = props => {
  const [loading, setLoading] = useState(true)
  const [workers, setWorkers] = useState([])
  const [getWorkers, service] = props

  useEffect(() => {
    getWorkers(service).then(workersData => {
      const availableWorkers = workersData.filter(worker => worker.cnpjVerificado && worker.disponibilidade >= service.numeroDiariasEm4Semanas)
      setWorkers(availableWorkers.sort((xDistance, yDistance) => xDistance - yDistance))
      setLoading(false)
    })
  }, [])

  return (
    <div>
      {
        loading
        ? <CircularProgress />
        : workers.map(worker => <ServiceCard
            key={worker.uid}
            worker={worker}
            {...props}
          />)
      }
    </div>
  )
}

export default ServiceCardList