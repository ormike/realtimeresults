# realtimeresults
Web app to upload a file from one page and display it on another

After developing inside the container, use rsync to get the changes out
so they will be included in the next container build.

```
rsync -avn --exclude node_modules --exclude dist app@172.26.0.2:realtimeresults/ Container/realtimeresults/
```
