describe("AngularJS web client", function() {
    it("should have the right headings", function() {
        browser.get("http://localhost:8080");

        expect(browser.getTitle()).toEqual("Magellan");
        expect(element(by.css("h1")).getText()).toEqual("Magellan");
        expect(element(by.css("h3")).getText()).toEqual("Test your knowledge about the countries of our world");
    });
});