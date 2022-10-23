# potential_enigma

# v1.2.0 (new release)

**_New Features_**

-   add cache for response
-   new endpoints to get tech, home and fashion deals
-   new payload response: /products and /status
-   if payload's value is not informed by seller, then it will be filled like "uninformed"

**_Support for eBay subdomains_**
This feature is supported by the following endpoints:

-   **GET**/products
-   **GET**/products/:id

If you want to access a subdomain, provide the **country** parameter with one of the supported countries below.

-   **australia**: http://www.ebay.com.au
-   **austria**: http://www.ebay.at
-   **canada**: http://www.ebay.ca
-   **france**: http://www.ebay.fr
-   **germany**: http://www.ebay.de
-   **hong kong**: http://www.ebay.com.hk
-   **ireland**: http://www.ebay.ie
-   **italy**: http://www.ebay.it
-   **malaysia**: http://www.ebay.com.my
-   **netherlands**: http://www.ebay.nl
-   **philippines**: http://www.ebay.ph
-   **poland**: http://www.ebay.pl
-   **singapore**: http://www.ebay.com.sg
-   **spain**: http://www.ebay.es
-   **switzerland**: http://www.ebay.ch
-   **united kingdom**: http://www.ebay.co.uk

### New endpoints

**| deals |**

-   _GET/deals/tech_
    -   without params
    -   response

```
[
    {
        "product_name": "2020 Apple iPad 8th Geração 32/128GB Wifi 10.2\" Modelo mais recente",
        "price": "1 634,49",
        "original_price": "uninformed",
        "currency": "BRL",
        "discount": 0,
        "product_condition": "uninformed",
        "sale_status": "Quase esgotado",
        "link": "https://www.ebay.com/itm/383791923777?_trkparms=5373%3A5000014449%7C5374%3ATech%7C5079%3A5000014449",
        "image": "https://i.ebayimg.com/images/g/5R0AAOSwMDZhTrQk/s-l225.jpg"
    }
]
```

-   _GET/deals/fashion_
    -   without params
    -   response

```
[
    {
        "product_name": "Nike Masculino com Capuz Manga Longa Atlético Velo Academia Athletic Moletom Com Capuz",
        "price": "232,88",
        "original_price": "739,23",
        "currency": "BRL",
        "discount": "-68.61%",
        "product_condition": "uninformed",
        "sale_status": "Quase esgotado",
        "link": "https://www.ebay.com/itm/203993185057?_trkparms=5373%3A5000014492%7C5374%3AFashion%7C5079%3A5000014492",
        "image": "https://i.ebayimg.com/images/g/RHMAAOSwIG9irCOw/s-l225.jpg"
    }
]
```

-   _GET/deals/home_
    -   without params
    -   response

```
[
    {
        "product_name": "Garrafa Térmica Aço Inoxidável 16 Oz Rei isolada de aço inoxidável Caneca de viagem com Alça",
        "price": "126,56R",
        "original_price": "105,55",
        "currency": "BRL",
        "discount": "20.00%",
        "product_condition": "uninformed",
        "sale_status": "Quase esgotado",
        "link": "https://www.ebay.com/itm/382324124062?_trkparms=5373%3A5000014556%7C5374%3AHome%7C5079%3A5000014557",
        "image": "https://ir.ebaystatic.com/pictures/aw/pics/s_1x2.gif"
    }
]
```

### New payload response

**| status |**

-   _GET/status/server_
    -   without params
    -   response
        -   **remove keys**: ebay_domain and connection

```
{
    "msg": "Current Server status",
    "name": "ebay-scraper-server",
    "environment": "production",
    "version": "1.2.0",
    "status": "200",
    "status_text": "OK",
    "uptime": 1666490345511,
    "hash": "29570514-8d6d-4416-9e42-e05203683894"
}
```

**| products |**

-   GET/products

    -   params
        -   page_number: **mandatory**
        -   product: **mandatory**
        -   country: **optional**
    -   response
        -   **new keys**: sales_potential and reviews

```
[
    {
        "product_id": "115576217898",
        "name": "New ListingNEW HP 564 3-Pack CYAN/YELLOW/MAGENTA Ink Cartridges + Photo Paper J2X80AN QTY 2",
        "condition": "Brand New",
        "price": "C $26.11",
        "discount": "uninformed",
        "product_location": "from United States",
        "logistics_cost": "+C $37.56 shipping estimate",
        "description": "Brand New",
        "sales_potential": "uninformed",
        "link": "https://www.ebay.ca/itm/115576217898?epid=6019370045&hash=item1ae8e1212a:g:aeIAAOSwSxNjVHUG&amdata=enc%3AAQAHAAAA4KBFkkcuHmN7YPLlgNa7crSHDtCOIqG3j0cLesS71a%2F3s%2FbH%2B6I7ZGPkfiwcKLtDx40N7u5INZuvWc8xH2sy0IfVpJVWt4zdAN%2BSS2VI5wNyP1bCbaa%2FFYxlnNRttXGirPl%2B5EdQ8f5T1PFdRZ7FAau2HHx6RCSsAG2tbbO12fyln34LlmEVOcJzVM7nywncTapPxy5uRxZimVc6hSzamWLyp3FM9xl0QheRtHdyfWk8oZxsMFVCsLINdHzDMBEg8EqVMCdSEFRI56q1SER9Fop7swpobxpUx7s1pYVFy9hZ%7Ctkp%3ABk9SR5aly7CAYQ",
        "reviews": "https://www.ebay.ca/p/6019370045?iid=115576217898&rt=nc#UserReviews",
        "thumbnail": "https://i.ebayimg.com/thumbs/images/g/aeIAAOSwSxNjVHUG/s-l225.jpg"
    }
 ]
```

-   GET/products/:id
    -   params
        -   id: **mandatory**
        -   country: **optional**
    -   response
        -   **new keys**: product_name, shipping, more_infos.seller, more_infos.feefback_profile, more_infos.store

```
{
    "product_id": "133051277200",
    "product_name": "$8.25/Mo Red Pocket Prepaid Wireless Phone Plan+Kit:1000 Talk Unlimited Text 1GB",
    "link": "http://www.ebay.com.au/itm/133051277200",
    "quantity_available": "Limited quantity available",
    "price": "US $99.00",
    "logistics_cost": "Approximately AU $156.78(including postage)",
    "last_24_hours": "23 sold in last 24 hours",
    "sold": "37,267",
    "delivery": "uninformed",
    "return_period": "Returns",
    "description": "$8.25/Mo Red Pocket Prepaid Wireless Phone Plan+Kit:1000 Talk Unlimited Text 1GB",
    "shipping": "(approx. AU $32.46)International delivery of items may be subject to customs processing and additional charges.Located in: Yonkers, New York, United StatesPlease allow additional time if international delivery is subject to customs processing.Yonkers, New York, United StatesWorldwideBarbados, French Guiana, French Polynesia, Guadeloupe, Libya, Martinique, New Caledonia, Reunion, Russian Federation, Ukraine, Venezuela",
    "more_infos": {
        "seller": "Red Pocket Store",
        "feedback_profile": "https://www.ebay.com.au/usr/redpocketstore?_trksid=p2047675.m3561.l2559",
        "store": "https://www.ebay.com.au/str/redpocketstore?_trksid=p2047675.m145687.l149086"
    }
}
```

### Endpoints without changes

**| status |**

-   _GET/_ and _GET/status/api_

    -   response: _>> no changes_
