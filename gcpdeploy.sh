gcloud functions deploy bethpage \
	--runtime=nodejs12 \
	--memory=1GB \
	--allow-unauthenticated \
	--trigger-topic=bethpage \
	--source=gcp \
	--entry-point=findTimes \
	--stage-bucket=golfreservation \
	--env-vars-file=var.yaml
