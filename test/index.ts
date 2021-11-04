import { expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";

describe("RoomBooking", () => {
  let roomBooking: any;
  let companies: string[];
  let cokeAdmin: string;
  let pepsiAdmin: string;
  let unknownUser: string;
  let newWhitelistUser: string;

  before(async () => {
    const namedAccounts = await getNamedAccounts();
    cokeAdmin = namedAccounts.cokeAdmin;
    pepsiAdmin = namedAccounts.pepsiAdmin;
    unknownUser = namedAccounts.unknownUser;
    newWhitelistUser = namedAccounts.newWhitelistUser;
  });

  describe("Check whitelist after contract creation", () => {
    beforeEach(async () => {
      const { RoomBooking } = await deployments.run(["RoomBooking"]);
      roomBooking = await ethers.getContractAt(
        await RoomBooking.abi,
        await RoomBooking.address
      );
      companies = await roomBooking.getCompanies();
    });

    it("Should return true for each whitelist address", async () => {
      expect(await roomBooking.whitelist(companies[0], cokeAdmin)).to.equal(
        true
      );
      expect(await roomBooking.whitelist(companies[1], pepsiAdmin)).to.equal(
        true
      );
    });

    it("Should return false for address not present in whitelist", async () => {
      expect(await roomBooking.whitelist(companies[0], unknownUser)).to.equal(
        false
      );
    });
  });

  describe("Test reserveRoomSpace", () => {
    beforeEach(async () => {
      const { RoomBooking } = await deployments.run(["RoomBooking"]);
      roomBooking = await ethers.getContractAt(
        await RoomBooking.abi,
        await RoomBooking.address
      );
      companies = await roomBooking.getCompanies();
    });

    it("Revert with 'Not allowed to reserve room!'", async () => {
      const signers = await ethers.getSigners();
      // Try to reserve room with no admin user
      await expect(
        roomBooking.connect(signers[0]).reserveRoomSpace(companies[0], 0, 0)
      ).to.be.revertedWith("Not allowed to reserve room!");
    });

    it("Revert with 'Slot is out of range!'", async () => {
      const signers = await ethers.getSigners();
      // Try to reserve room with no admin user
      await expect(
        roomBooking.connect(signers[1]).reserveRoomSpace(companies[0], 8, 0)
      ).to.be.revertedWith("Slot is out of range!");
    });

    it("Revert with 'Room is out of range!'", async () => {
      const signers = await ethers.getSigners();
      // Try to reserve room with no admin user
      await expect(
        roomBooking.connect(signers[1]).reserveRoomSpace(companies[0], 7, 10)
      ).to.be.revertedWith("Room is out of range!");
    });

    it("Should return true after reserveRoomSpace", async () => {
      const signers = await ethers.getSigners();
      const cokeCompany = companies[0];
      await roomBooking.connect(signers[1]).reserveRoomSpace(cokeCompany, 0, 0);
      const room = await roomBooking.roomlist(cokeCompany, 0, 0);
      await expect(room.booked).to.be.equal(true);
      await expect(room.owner).to.be.equal(cokeAdmin);
    });

    it("Should emit Reserved", async () => {
      const signers = await ethers.getSigners();
      const cokeCompany = companies[0];

      await expect(
        await roomBooking
          .connect(signers[1])
          .reserveRoomSpace(cokeCompany, 0, 0)
      )
        .to.emit(roomBooking, "Reserved")
        .withArgs(cokeAdmin, cokeCompany, 0, 0);
    });
  });

  describe("Test addWhitelist", () => {
    beforeEach(async () => {
      const { RoomBooking } = await deployments.run(["RoomBooking"]);
      roomBooking = await ethers.getContractAt(
        await RoomBooking.abi,
        await RoomBooking.address
      );
      companies = await roomBooking.getCompanies();
    });

    it("Revert with 'Operation not allowed!'", async () => {
      const signers = await ethers.getSigners();
      // Try to addWhitelist with no admin user
      await expect(
        roomBooking
          .connect(signers[0])
          .addWhitelist(companies[0], newWhitelistUser)
      ).to.be.revertedWith("Operation not allowed!");
    });

    it("Revert with 'Address already whitelisted!'", async () => {
      const signers = await ethers.getSigners();
      // Try to addWhitelist with already existing address
      await expect(
        roomBooking.connect(signers[1]).addWhitelist(companies[0], cokeAdmin)
      ).to.be.revertedWith("Address already whitelisted!");
    });

    it("Should return true after addWhitelist new address", async () => {
      const signers = await ethers.getSigners();
      const pepsiCompany = companies[1];
      await roomBooking
        .connect(signers[2])
        .addWhitelist(pepsiCompany, newWhitelistUser);
      await expect(
        await roomBooking.whitelist(pepsiCompany, newWhitelistUser)
      ).to.be.equal(true);
    });

    it("Should emit Whitelisted", async () => {
      const signers = await ethers.getSigners();
      const pepsiCompany = companies[1];

      await expect(
        await roomBooking
          .connect(signers[2])
          .addWhitelist(pepsiCompany, newWhitelistUser)
      )
        .to.emit(roomBooking, "Whitelisted")
        .withArgs(pepsiCompany, newWhitelistUser);
    });
  });
});
