gcloud functions deploy gcptest \
	--runtime=nodejs12 \
	--memory=128MB \
	--allow-unauthenticated \
	--trigger-http \
	--source=test \
	--entry-point=index \
	--stage-bucket=golfreservationtest12345
