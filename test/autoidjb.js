contract('AUTOIDJB', function(accounts) {
  it("should add songs", function() {
    var jukebox = AUTOIDJB.deployed();

    return jukebox.addSong("1 Title", "1 Author", "iqzt3T4R38c", {from: accounts[0]}).then(function(txData) {
    });
  });
});
