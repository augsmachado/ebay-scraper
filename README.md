# potential_enigma

# v1.1.0 (new release)

**NEW FEATURE: _Support for eBay subdomains_**
This feature is supported by the following endpoints:

-   **GET**/products
-   **GET**/products/:id
-   **GET**/deals

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

### endpoints

**| status |**

-   _GET/_ and _GET/status/api_

    -   response: _>> no changes_

-   GET/status/server
    -   params
        -   country: **optional**
    -   response

```
{
    "msg": "Current Server status",
    "name": "ebay-scraper-server",
    "environment": "production",
    "version": "1.1.0",
    "uptime": 1654371455712,
    "hash": "07fd411e-dfae-4b4e-81cb-2ec37ff2d31b",
    "ebay_domain": "http://www.ebay.com.au",
    "status_text": "OK",
    "status": "200"
}
```

**| products |**

-   GET/products

    -   params
        -   page_number: **mandatory**
        -   product: **mandatory**
        -   country: **optional**
    -   response: _>> no changes_

-   GET/products/:id
    -   params
        -   id: **mandatory**
        -   country: **optional**
    -   response: _>> no changes_

**| deals |**

-   GET/deals
    -   params
        -   country: **optional**
    -   response: _>> no changes_

# v1.0.0 (old)

### endpoints

**| status |**

-   _GET/_ and _GET/status/api_
    -   response

```
{
    "msg": "Current API status",
    "name": "ebay-scraper-api",
    "environment": "production",
    "version": "1.0.0",
    "uptime": 1654367184835,
    "hash": "568073a1-9d24-45f9-96cb-3114ae7fedd5"
}
```

-   GET/status/server
    -   response

```
{
    "msg": "Current Server status",
    "name": "ebay-scraper-server",
    "environment": "production",
    "version": "1.0.0",
    "uptime": 1654368439072,
    "hash": "7ae292eb-30bf-474d-b921-8747da6705de",
    "status_text": "OK",
    "status": "200"
}
```

**| products |**

-   GET/products
    -   params
        -   page_number: **mandatory**
        -   product: **mandatory**
    -   response

```
{
    "product_id": "390525081441",
    "name": "NEW WOMENS LADIES CONCEALED PLATFORM STILETTO HIGH HEELS COURT SHOES SIZE 3-8",
    "condition": "Brandneu",
    "price": "EUR 23,35",
    "discount": "",
    "product_location": "aus Großbritannien",
    "logistics_cost": "+EUR 16,34 Versand",
    "description": "Brandneu: Gewerblich",
    "link": "https://www.ebay.at/itm/390525081441?hash=item5aed1bd761:g:36AAAOSwal5YGf~W",
    "thumbnail": "https://i.ebayimg.com/thumbs/images/g/36AAAOSwal5YGf~W/s-l225.jpg"
    }
```

-   GET/products/:id
    -   params
        -   id: **mandatory**
    -   response

```
{
    "product_id": "304514634779",
    "link": "http://www.ebay.com/itm/304514634779",
    "quantity_available": "2 disponíveis",
    "price": "GBP 220,00",
    "logistics_cost": "",
    "last_24_hours": "1 observado nas últimas 24 horas",
    "sold": "30",
    "delivery": "",
    "return_period": "",
    "description": "🔥 Nike Air Max Plus Tn sintonizado Tênis Masculino Preto/Azul DV3493-001 Reino Unido 8 🔥-",
    "more_infos": "GBP 44.35 (aproximadamente R$ 265.92) Entrega urgente para Brasil via ....."
}
```

**| deals |**

-   GET/deals
    -   response

```
{
    "product_name: "Lenovo Legion 5 Pro 16 165Hz qHD in-plane de comutação Nvidia G-SYNC 500 nits laptop para jogos AMD R",
    "price": " 6 650,87",
    "original_price": " 8 187,84",
    "currency": "BRL",
    "discount": "-25.00%",
    "product_condition": null,
    "sale_status": null,
    "link": "https://www.ebay.com/itm/125058259597?_trkparms=5373%3A0%7C5374%3AFeatured",
    "image": "https://i.ebayimg.com/images/g/pxcAAOSwis1hwW4V/s-l225.jpg"
}
```
