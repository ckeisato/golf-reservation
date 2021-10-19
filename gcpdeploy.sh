gcloud functions deploy bethpage \
	--runtime=nodejs12 \
	--memory=1GB \
	--allow-unauthenticated \
	--trigger-topic=bethpage \
	--source=gcp \
	--entry-point=index \
	--stage-bucket=golfreservation \
	# --build-env-vars-file=var.yaml
