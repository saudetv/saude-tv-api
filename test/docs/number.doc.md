# Test Documents of Number

## **NUMBER**

|  Route | Method  | Headers  | Body  |
|---|---|---|---|---|
|  v1/numbers | POST  | Accept: application/json  | { name: "Análise e Desenvolvimento de sistemas", initials: "ADS", type: "problem" }  |
|  v1/numbers/{id} | GET  | Accept: application/json  | null  |
|  v1/numbers/{id} | PUT  | Accept: application/json  | { name: "Farmácia", initials: "FAR", type: "problem" }  |
|  v1/numbers | GET | Accept: application/json  | null |
|  v1/numbers/{id}  | DELETE | Accept: application/json  | null |

### Expected return

```php
"name",
"initials",
"type"
```