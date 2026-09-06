import { Router } from "express";
import {
  createMemberHandler,
  deleteMemberHandler,
  getMemberByIdHandler,
  getMembersHandler,
  updateMemberHandler,
  updateMemberPhotoHandler,
} from "../modules/member/member.controller";
import { authenticate } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";

const memberRouter = Router();

memberRouter.use(authenticate);

memberRouter.post("/", createMemberHandler);
memberRouter.get("/all-members", getMembersHandler);
memberRouter.get("/:id", getMemberByIdHandler);
memberRouter.patch(
  "/img/:id",
  upload.single("photo"),
  updateMemberPhotoHandler,
);
memberRouter.patch("/:id", updateMemberHandler);
memberRouter.delete("/:id", deleteMemberHandler);

export default memberRouter;
