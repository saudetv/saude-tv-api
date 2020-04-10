# Test Documents of Course

## **COURSE**

|  Route | Method  | Headers  | Body  |
|---|---|---|---|---|
|  v1/courses | POST  | Accept: application/json  | { initials: "ADS", name: "Análise e desenvolvimento de sistemas" }  |
|  v1/courses/{id} | GET  | Accept: application/json  | null  |
|  v1/courses/{id} | PUT  | Accept: application/json  | { initials: "FAR", name: "Farmacia" }  |
|  v1/courses | GET | Accept: application/json  | null |
|  v1/courses/{id}  | DELETE | Accept: application/json  | null |

### Expected return

```php
"name",
"initials",
"createdAt",
"stats"
```