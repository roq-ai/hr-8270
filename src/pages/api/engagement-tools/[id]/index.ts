import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { engagementToolValidationSchema } from 'validationSchema/engagement-tools';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.engagement_tool
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getEngagementToolById();
    case 'PUT':
      return updateEngagementToolById();
    case 'DELETE':
      return deleteEngagementToolById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEngagementToolById() {
    const data = await prisma.engagement_tool.findFirst(convertQueryToPrismaUtil(req.query, 'engagement_tool'));
    return res.status(200).json(data);
  }

  async function updateEngagementToolById() {
    await engagementToolValidationSchema.validate(req.body);
    const data = await prisma.engagement_tool.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteEngagementToolById() {
    const data = await prisma.engagement_tool.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
