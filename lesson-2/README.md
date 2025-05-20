API example

_GET_ http://localhost:3000/users

_POST_ http://localhost:3000/users

```json
{
  "name": "Test user",
  "email": "test@mail.com"
}
```

_PUT_ http://localhost:3000/users

```json
{
  "id": 0,
  "data": {
    "name": "Test user",
    "email": "test@mail.com"
  }
}
```

_DELETE_ http://localhost:3000/users

```json
{
  "id": 0
}
```
