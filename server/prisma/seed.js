import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const memberPasswordHash = await bcrypt.hash("member123", 10);

  const [admin, memberOne, memberTwo] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {
        name: "Admin User",
        passwordHash: adminPasswordHash,
        role: "ADMIN",
      },
      create: {
        name: "Admin User",
        email: "admin@example.com",
        passwordHash: adminPasswordHash,
        role: "ADMIN",
      },
    }),
    prisma.user.upsert({
      where: { email: "member@example.com" },
      update: {
        name: "Member User",
        passwordHash: memberPasswordHash,
        role: "MEMBER",
      },
      create: {
        name: "Member User",
        email: "member@example.com",
        passwordHash: memberPasswordHash,
        role: "MEMBER",
      },
    }),
    prisma.user.upsert({
      where: { email: "member2@example.com" },
      update: {
        name: "Member Two",
        passwordHash: memberPasswordHash,
        role: "MEMBER",
      },
      create: {
        name: "Member Two",
        email: "member2@example.com",
        passwordHash: memberPasswordHash,
        role: "MEMBER",
      },
    }),
  ]);

  const [projectOne, projectTwo] = await Promise.all([
    prisma.project.upsert({
      where: { id: "seed-project-website" },
      update: {
        name: "Website Redesign",
        description: "Refresh the marketing site, improve conversion paths, and tighten the release workflow.",
        ownerId: admin.id,
      },
      create: {
        id: "seed-project-website",
        name: "Website Redesign",
        description: "Refresh the marketing site, improve conversion paths, and tighten the release workflow.",
        ownerId: admin.id,
      },
    }),
    prisma.project.upsert({
      where: { id: "seed-project-mobile" },
      update: {
        name: "Mobile Launch",
        description: "Coordinate the mobile launch checklist, polish onboarding, and monitor high-priority blockers.",
        ownerId: admin.id,
      },
      create: {
        id: "seed-project-mobile",
        name: "Mobile Launch",
        description: "Coordinate the mobile launch checklist, polish onboarding, and monitor high-priority blockers.",
        ownerId: admin.id,
      },
    }),
  ]);

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: projectOne.id,
        userId: memberOne.id,
      },
    },
    update: {},
    create: {
      projectId: projectOne.id,
      userId: memberOne.id,
    },
  });

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: projectOne.id,
        userId: memberTwo.id,
      },
    },
    update: {},
    create: {
      projectId: projectOne.id,
      userId: memberTwo.id,
    },
  });

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: projectTwo.id,
        userId: memberOne.id,
      },
    },
    update: {},
    create: {
      projectId: projectTwo.id,
      userId: memberOne.id,
    },
  });

  const tasks = [
    {
      title: "Finalize landing page copy",
      description: "Polish hero messaging and confirm the final call-to-action with marketing.",
      status: "TODO",
      priority: "HIGH",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      projectId: projectOne.id,
      assignedToId: memberOne.id,
      createdById: admin.id,
    },
    {
      title: "Review updated design system",
      description: "Approve the spacing, color, and accessibility updates for the new redesign.",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      projectId: projectOne.id,
      assignedToId: memberTwo.id,
      createdById: admin.id,
    },
    {
      title: "QA signup funnel",
      description: "Run a regression pass through onboarding and payment handoff.",
      status: "DONE",
      priority: "HIGH",
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      projectId: projectOne.id,
      assignedToId: admin.id,
      createdById: admin.id,
    },
    {
      title: "Prepare app store checklist",
      description: "Capture remaining launch blockers for iOS and Android store submissions.",
      status: "TODO",
      priority: "HIGH",
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      projectId: projectTwo.id,
      assignedToId: memberOne.id,
      createdById: admin.id,
    },
    {
      title: "Monitor crash analytics",
      description: "Track release candidate stability and summarize top crash trends.",
      status: "IN_PROGRESS",
      priority: "LOW",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      projectId: projectTwo.id,
      assignedToId: admin.id,
      createdById: admin.id,
    },
  ];

  for (const task of tasks) {
    await prisma.task.upsert({
      where: {
        id: `${task.projectId}-${task.title.toLowerCase().replaceAll(" ", "-")}`,
      },
      update: task,
      create: {
        id: `${task.projectId}-${task.title.toLowerCase().replaceAll(" ", "-")}`,
        ...task,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
