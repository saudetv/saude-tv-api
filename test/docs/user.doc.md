# Test Documents of User

## **User**

|  Route | Method  | Headers  | Body  |
|---|---|---|---|---|
|  v1/users | POST  | Accept: application/json  | { username: "Vitor Atualiado", name: "Vitor", password: "123" }  |
|  v1/users/{id} | GET  | Accept: application/json  | null  |
|  v1/users/{id} | PUT  | Accept: application/json  | { username: "Vitor2", name: "Vitor2", password: "122223" }  |
|  v1/users | GET | Accept: application/json  | null |
|  v1/users/{id}  | DELETE | Accept: application/json  | null |

### Expected return

```php
"createdAt",
"stats",
"_id",
"username",
"name",
"password",
"courses"
```