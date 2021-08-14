import "./loading.css";

const Loading = () => {
  return (
    <div className="loading-container">
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
