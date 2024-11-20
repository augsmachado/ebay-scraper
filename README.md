# README
Ebay Data Scraper is the easiest way to get access to product, price, sales rank and reviews data from Ebay in JSON format.

Read more in [Postman Documenter](https://documenter.getpostman.com/view/4547078/2s84LStAFX)

## v3.0.1-beta (new release)

**_New Features_**

-   add cache for response
-   new endpoints to get tech, home and fashion deals
-   new payload response: /products and /status
-   if payload's value is not informed by seller, then it will be filled like "uninformed"
-   new endpoint to get product reviews
-   this new version fix bugs like filling in empty fields, allowing searches with multiple terms, bringing more details about the product and the seller
-    add upc code to products
-    add endpoint to search products by seller

We have unified the **product details and seller feedback endpoints** under the following path **/products/{id}**. In this new configuration, in addition to the product details, you will also find a **REVIEWS object** that contains the following information:
- seller name
- link to the seller logo
- percentage of positive feedbacks
- number of products that have been sold
- number of feedbacks received for the product
- if present on Ebay, then there will be a Read More section


# **_Support for eBay subdomains_**

The USA subdomain not need to be selected, because it is the mais domain.

This feature is supported by the following endpoints:

-   **GET**/products

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


# Endpoint answer
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
        "link": "https://www.ebay.ca/itm/115576217898?epid=6019370045&amp;hash=item1ae8e1212a:g:aeIAAOSwSxNjVHUG&amp;amdata=enc%3AAQAHAAAA4KBFkkcuHmN7YPLlgNa7crSHDtCOIqG3j0cLesS71a%2F3s%2FbH%2B6I7ZGPkfiwcKLtDx40N7u5INZuvWc8xH2sy0IfVpJVWt4zdAN%2BSS2VI5wNyP1bCbaa%2FFYxlnNRttXGirPl%2B5EdQ8f5T1PFdRZ7FAau2HHx6RCSsAG2tbbO12fyln34LlmEVOcJzVM7nywncTapPxy5uRxZimVc6hSzamWLyp3FM9xl0QheRtHdyfWk8oZxsMFVCsLINdHzDMBEg8EqVMCdSEFRI56q1SER9Fop7swpobxpUx7s1pYVFy9hZ%7Ctkp%3ABk9SR5aly7CAYQ",
        "reviews": "https://www.ebay.ca/p/6019370045?iid=115576217898&amp;rt=nc#UserReviews",
        "thumbnail": "https://i.ebayimg.com/thumbs/images/g/aeIAAOSwSxNjVHUG/s-l225.jpg"
    }
 ]
```

-   GET/products/{id}

    -   params
        -   product_id: **mandatory**
        -   country: **optional**

```
[
    {
        "product_id": "326150465337",
        "product_name": "Apresentador a laser antimicrobiano Targus Control Max modo duplo com temporizador",
        "link": "https://www.ebay.com/itm/326150465337",
        "quantity_available": "undefined",
        "price": "US $28,49",
        "discounted_price": "",
        "logistics_cost": "Frete:Pode não fazer envios para Brasil. Leia a descrição do item ou contate o vendedor para saber quais são as opções de envio. Ver detalhespara envioLocalizado em: Brooklyn, New York, Estados Unidos",
        "last_24_hours": "",
        "delivery": "Entrega:Varia",
        "return_period": "O",
        "description": "Apresentador a laser antimicrobiano Targus Control Max modo duplo com temporizador ",
        "upc": "092636356897",
        "shipping": "Localizado em: Brooklyn, New York, Estados Unidos",
        "product_images": [
            "https://i.ebayimg.com/images/g/urIAAOSwGbxmXiJe/s-l140.jpg",
            "https://i.ebayimg.com/images/g/ve8AAOSwZGpmXiJf/s-l140.jpg"
        ],
        "seller_infos": [
            {
                "seller": "DRWIRELESSLI",
                "logotype": "https://i.ebayimg.com/images/g/FO8AAOSwPwJhTNom/s-l140.jpg",
                "contact": "https://www.ebay.com/cnt/FindAnswers?ShowSellerFAQ=&item_id=326150465337&requested=drwirelessli&redirect=0&frm=284&rt=nc&ssPageName=PageSellerM2MFAQ_VI&_trksid=p4429486.m145687.l149087&_caprdt=1",
                "positive_feedback": "99,1%",
                "sold_items": "",
                "number_feedbacks": "",
                "store_link": "https://www.ebay.com/sch/drwirelessli/m.html?item=326150465337&rt=nc&_trksid=p4429486.m145687.l2562"
            }
        ]
    }
]

```
