# golf-reservation
todo:
- cleanup: change selectors to use xpath to search for visible text
- cleanup: date picker selector?


7pm booker:
- GCP function, at 6:59:500 executes function
- checks availability
- given hour, books first option within the hour


schedule polling:
- runs every 10 min
- checks for available times 
    - each day
    - each course
- sends availablity by text/email