ALTER TABLE "_externalAuths" RENAME COLUMN "collectionId" TO "collection_id";--> statement-breakpoint
ALTER TABLE "_externalAuths" DROP CONSTRAINT "_externalAuths_collectionId__collections_id_fk";
--> statement-breakpoint
ALTER TABLE "_externalAuths" ADD CONSTRAINT "_externalAuths_collection_id__collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."_collections"("id") ON DELETE no action ON UPDATE no action;