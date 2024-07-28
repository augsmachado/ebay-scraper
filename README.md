# potential_enigma

Ebay Data Scraper is the easiest way to get access to product, price, sales rank and reviews data from Ebay in JSON format.
Read more in [Postman Documenter](https://documenter.getpostman.com/view/4547078/2s84LStAFX)

# v3.0.0-beta (new release)

**_New Features_**

-   add cache for response
-   new endpoints to get tech, home and fashion deals
-   new payload response: /products and /status
-   if payload's value is not informed by seller, then it will be filled like "uninformed"
-   new endpoint to get product reviews
-   this new version fix bugs like filling in empty fields, allowing searches with multiple terms, bringing more details about the product and the seller
-   search products by sellers

**_Support for eBay subdomains_**
This feature is supported by the following endpoints:

-   **GET**/products
-   **GET**/products/:id
-   **GET**/products/:id/reviews

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
