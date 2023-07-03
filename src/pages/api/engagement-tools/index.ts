import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { engagementToolValidationSchema } from 'validationSchema/engagement-tools';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getEngagementTools();
    case 'POST':
      return createEngagementTool();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEngagementTools() {
    const data = await prisma.engagement_tool
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'engagement_tool'));
    return res.status(200).json(data);
  }

  async function createEngagementTool() {
    await engagementToolValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.engagement_tool.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
