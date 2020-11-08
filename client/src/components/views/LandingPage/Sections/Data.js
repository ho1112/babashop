const continents = [ //checkBox item
    {
        "_id" : 1,
        "name" : "アウター"
    },
    {
        "_id" : 2,
        "name" : "トップス"
    },
    {
        "_id" : 3,
        "name" : "ボトムス"
    },
    {
        "_id" : 4,
        "name" : "シューズ"
    },
    {
        "_id" : 5,
        "name" : "バッグ"
    },
    {
        "_id" : 6,
        "name" : "アクセサリー"
    },
    {
        "_id" : 7,
        "name" : "香水"
    }
]

const price = [ //price item
    {
        "_id" : 0,
        "name" : "Any",
        "array" : []
    },
    {
        "_id" : 1,
        "name" : "¥0 to ¥5000",
        "array" : [0, 5000]
    },
    {
        "_id" : 2,
        "name" : "¥5001 to 8000",
        "array" : [5001,8000]
    },
    {
        "_id" : 3,
        "name" : "¥8001 to 10000",
        "array" : [8001,10000]
    },
    {
        "_id" : 4,
        "name" : "¥10000 to 20000",
        "array" : [10000,20000]
    },
    {
        "_id" : 5,
        "name" : "More than ¥20000",
        "array" : [20000,150000000]
    }
]

export {
    continents,
    price
}
