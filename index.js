const axios = require('axios');


let getPegaList = async (budget, winrate=0) => {
    const response = await axios.get('https://api-apollo.pegaxy.io/v1/pegas/prices/floor');
    const json = await response.data;
    const pegaList = json.filter(m => (m['price'] <= budget));
    var budgetPegas = {};
    
    for (pega in Object.values(pegaList)){
        budgetPegas[pegaList[pega]['pegaIds'][0]] = {'listingId': pegaList[pega]['listingIds'][0], 'price': pegaList[pega]['price']};
    }
    var highWrPegas = {};
    for ([pega,data] of Object.entries(budgetPegas)){     
        const getWR = await axios.get(`https://api-apollo.pegaxy.io/v1/pegas/${pega}`)
        
        if (getWR.data.winRate >= winrate/100){
            highWrPegas[data['listingId']] = {'wr': getWR['data']['winRate'], 'price': data['price']};
        }
    }

    console.log(highWrPegas);
}

getPegaList(500);
