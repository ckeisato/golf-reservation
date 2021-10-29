cp src/util.js src_gcp/

gcloud functions deploy bethpage \
	--runtime=nodejs12 \
	--memory=1GB \
	--allow-unauthenticated \
	--trigger-topic=bethpage \
	--source=src_gcp \
	--entry-point=findTimes \
	--stage-bucket=golfreservation \
	--env-vars-file=gcpvar.yaml


gcloud scheduler jobs update pubsub golfCheck \
	--topic=projects/golf-reservation-314002/topics/bethpage \
	--schedule="*/5 9-22 * * 5-6"
