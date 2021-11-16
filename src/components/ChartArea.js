import axios from "axios"
import {Line} from "react-chartjs-2"
import { useEffect, useState } from "react"

function ChartArea() {
    const [config, setConfig] = useState({})
    const [loaded, setLoaded] = useState(false)
    const [start, setStart] = useState("")
    const [end, setEnd] = useState("")
    const [currency, setCurrency] = useState("USD")
    const [info, setInfo] = useState({})

    useEffect(()=>{
        let url = `?currency=${currency}`
        if (start && end) {
            url = `${url}&start=${start}&end=${end}`
        }
        axios.get(`http://api.coindesk.com/v1/bpi/historical/close.json${url}`).then(
            response => {
                let responseObj = {labels: Object.keys(response.data.bpi), data: Object.values(response.data.bpi)}
                let numbers = Object.values(response.data.bpi)
                let max = numbers.reduce((a,b) => Math.max(a,b))
                let min = numbers.reduce((a,b) => Math.min(a,b))
                setInfo({max: max, min: min})
                console.log(numbers)
                console.log(info)
                return responseObj}).then( 
                    response =>{
                        setConfig(
                            {labels: response.labels, 
                            datasets: [{
                                label:"Currency",
                                data: response.data, 
                                backgroundColor: 'rgb(255, 99, 132)', 
                                borderColor: 'rgba(255, 99, 132, 0.2)'
                            }],                
                            }
                        )
                    }).then(() => {
                            setLoaded(true)
                        }) 
        } , 
    [start, end, currency])
        
    const onChangeStart = (event) => {
        setStart(event.target.value)
    }

    const onChangeEnd = (event) => {
        setEnd(event.target.value)
    }

    const onChangeCurrency = (event) => {
        setCurrency(event.target.value)
    }

    return (
        <div>
        {   
            loaded &&
            <div>
                <input type="date" onChange = {onChangeStart}/>
                <input type="date" onChange = {onChangeEnd}/>
                <select onChange={onChangeCurrency}>
                    <option value="USD"> US Dollar</option>
                    <option value="EUR"> Euro</option>
                </select>
                <div>
                    <p>
                        Max Value is: {info.max}
                    </p>
                    <p>
                        Min Value is: {info.min}
                    </p>
                </div>
                <Line data={config}/>
            </div>
        }
        </div>
    )
}

export default ChartArea