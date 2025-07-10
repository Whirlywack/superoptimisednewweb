import { contentRouter } from "../contentRouter";
import { prisma } from "../../../db";

// Mock the database
jest.mock("../../../db", () => ({
  prisma: {
    contentBlock: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("contentRouter - Content Block CRUD", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllContentBlocks", () => {
    it("should return all content blocks", async () => {
      const mockBlocks = [
        {
          id: "block1",
          pageKey: "homepage",
          blockKey: "hero-title",
          contentType: "markdown",
          content: "# Welcome to our site",
          isActive: true,
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-02"),
        },
        {
          id: "block2", 
          pageKey: "about",
          blockKey: "mission",
          contentType: "text",
          content: "Our mission is to...",
          isActive: true,
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-02"),
        },
      ];

      mockPrisma.contentBlock.findMany.mockResolvedValue(mockBlocks as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const caller = contentRouter.createCaller({ db: mockPrisma });
      const result = await caller.getAllContentBlocks();

      expect(result.blocks).toHaveLength(2);
      expect(result.totalBlocks).toBe(2);
      expect(result.blocks[0].pageKey).toBe("homepage");
      expect(mockPrisma.contentBlock.findMany).toHaveBeenCalledWith({
        orderBy: [{ pageKey: "asc" }, { blockKey: "asc" }],
      });
    });
  });

  describe("createContentBlock", () => {
    it("should create a new content block", async () => {
      const newBlock = {
        pageKey: "contact",
        blockKey: "form-intro",
        contentType: "markdown" as const,
        content: "## Get in touch",
        isActive: true,
      };

      const createdBlock = {
        id: "new-block-id",
        ...newBlock,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.contentBlock.create.mockResolvedValue(createdBlock as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const caller = contentRouter.createCaller({ db: mockPrisma });
      const result = await caller.createContentBlock(newBlock);

      expect(result.id).toBe("new-block-id");
      expect(result.pageKey).toBe("contact");
      expect(mockPrisma.contentBlock.create).toHaveBeenCalledWith({
        data: newBlock,
      });
    });
  });

  describe("updateContentBlock", () => {
    it("should update an existing content block", async () => {
      const updateData = {
        id: "block1",
        content: "# Updated Welcome Message",
        contentType: "markdown" as const,
      };

      const updatedBlock = {
        id: "block1",
        pageKey: "homepage",
        blockKey: "hero-title",
        contentType: "markdown",
        content: "# Updated Welcome Message",
        isActive: true,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date(),
      };

      mockPrisma.contentBlock.update.mockResolvedValue(updatedBlock as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const caller = contentRouter.createCaller({ db: mockPrisma });
      const result = await caller.updateContentBlock(updateData);

      expect(result.content).toBe("# Updated Welcome Message");
      expect(mockPrisma.contentBlock.update).toHaveBeenCalledWith({
        where: { id: "block1" },
        data: {
          content: "# Updated Welcome Message",
          contentType: "markdown",
          updatedAt: expect.any(Date),
        },
      });
    });
  });

  describe("deleteContentBlock", () => {
    it("should delete a content block", async () => {
      mockPrisma.contentBlock.delete.mockResolvedValue({} as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const caller = contentRouter.createCaller({ db: mockPrisma });
      const result = await caller.deleteContentBlock({ id: "block1" });

      expect(result.success).toBe(true);
      expect(mockPrisma.contentBlock.delete).toHaveBeenCalledWith({
        where: { id: "block1" },
      });
    });
  });

  describe("toggleContentBlockStatus", () => {
    it("should toggle content block active status", async () => {
      const toggledBlock = {
        id: "block1",
        pageKey: "homepage", 
        blockKey: "hero-title",
        contentType: "markdown",
        content: "# Welcome",
        isActive: false,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date(),
      };

      mockPrisma.contentBlock.update.mockResolvedValue(toggledBlock as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const caller = contentRouter.createCaller({ db: mockPrisma });
      const result = await caller.toggleContentBlockStatus({ 
        id: "block1", 
        isActive: false 
      });

      expect(result.isActive).toBe(false);
      expect(mockPrisma.contentBlock.update).toHaveBeenCalledWith({
        where: { id: "block1" },
        data: {
          isActive: false,
          updatedAt: expect.any(Date),
        },
      });
    });
  });
});