const Home = () => {
  return (
    <>
      <h3 className="h3-header">Welcome to the Star Sailors DAO.</h3>
      <div>Read up on development news</div>
      <div>Connect with the team and fellow Star Sailors</div>
      <div>Stream the amazing game soundtrack, bought to you by Veonity</div>
      <div>Connect your Metamask wallet to access the minigames</div>

      <br />
      
      {/*
      <div data-frill-widget="b2371332-a75a-4bd5-8ee5-dc9cad18a43f" style="width: 340px; height: 460px;"></div>
      <script async src="https://widget.frill.co/v2/widget.js"></script>
      */}
      
      <style>{`
        .h3-header {
          font-size: 22px;
          margin: 25px 0;
        }
        div {
          font-size: 17px;
          margin-bottom: 15px;
        }
      `}</style>
    </>
  );
};

export default Home;