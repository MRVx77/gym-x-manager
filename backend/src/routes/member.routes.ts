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

const memberRouter = Router();

memberRouter.use(authenticate);

memberRouter.post("/", createMemberHandler);
memberRouter.get("/all-members", getMembersHandler);
memberRouter.get("/:id", getMemberByIdHandler);
memberRouter.put("/:id", updateMemberHandler);
memberRouter.put("/img/:id", updateMemberPhotoHandler);
memberRouter.delete("/:id", deleteMemberHandler);

export default memberRouter;
