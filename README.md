# Find where words are used in the bible
A indexed version of the bible is included as SQLite database. You can rebuild the database by running the management commands (and add them to the Docker file)

![the word love in the bible](https://raw.githubusercontent.com/stetelepta/bookstats/master/images/example.png)

### Requirements
* Docker

### Installation
*Create docker image with the app*
``` 
docker build --tag=bookstats . 
```

### Usage
*Run container*
```
docker run -d -p 8000:8000 bookstats
```
* When you run the app, it's available in your browser at http://localhost:8000
* Site administration: http://localhost:8000/admin (user: admin, pass: admin)

#### Management commands 
* Rebuild database from text files: `python manage.py import_content`
* Index database by word: `python manage.py count_words`
