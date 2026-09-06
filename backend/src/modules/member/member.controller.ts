import { Request, Response } from "express";
import { createMemberSchema, updateMemberSchema } from "./member.schema";
import {
  createMember,
  deleteMember,
  getMemberById,
  getMembers,
  updateMember,
  updateMemberPhoto,
} from "./member.services";
import { uploadToCloudinary } from "../../lib/cloudinary";

export async function createMemberHandler(req: Request, res: Response) {
  const gymId = req.user!.gymId!;
  const input = createMemberSchema.parse(req.body);

  const member = await createMember(gymId, input);

  res.status(201).json({ member });
}

export async function getMembersHandler(req: Request, res: Response) {
  const gymId = req.user!.gymId!;
  const search =
    typeof req.query.search === "string" ? req.query.search : undefined;
  const members = await getMembers(gymId, search as string);

  res.status(200).json({ members });
}

export async function getMemberByIdHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const gymId = req.user!.gymId!;
  const member = await getMemberById(gymId, req.params.id);

  res.status(200).json({ member });
}

export async function updateMemberHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const gymId = req.user!.gymId!;
  const memberId = req.params.id;
  const input = updateMemberSchema.parse(req.body);
  const member = await updateMember(gymId, memberId, input);

  res.status(200).json({ member });
}

export async function deleteMemberHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const gymId = req.user!.gymId!;
  const member = await deleteMember(req.params.id, gymId);

  res.status(200).json({ member });
}

export async function updateMemberPhotoHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const gymId = req.user!.gymId!;
  const memberId = req.params.id;

  const uploadResult = await uploadToCloudinary(
    req.file.buffer,
    "gym-manager/members",
  );

  const member = await updateMemberPhoto(
    memberId,
    gymId,
    uploadResult.secure_url,
  );
  res.status(200).json({ member });
}
