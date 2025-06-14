document.addEventListener("DOMContentLoaded", function () {
  const playsoundInput = document.getElementById("playsound");
  const pitchbendInput = document.getElementById("pitchbend");
  const calculateButton = document.getElementById("calculate");
  const resultDisplay = document.getElementById("result");
  const historyList = document.getElementById("history");
  const clearHistoryButton = document.getElementById("clearHistory");

  function calculatePlaysound(basePlaysound, pitchbend) {
    const n_base = Math.log2(basePlaysound) * 12 + 12;  // 逆算して n を求める
    const n_adjusted = n_base + pitchbend / 683;  // pitchbend に応じた修正
    return Math.pow(2, (n_adjusted - 12) / 12);
  }

  calculateButton.addEventListener("click", function () {
    const basePlaysound = parseFloat(playsoundInput.value);
    const pitchbend = parseInt(pitchbendInput.value, 10);

    if (isNaN(basePlaysound) || isNaN(pitchbend)) {
      resultDisplay.textContent = "無効な入力です";
      return;
    }

    const newPlaysound = calculatePlaysound(basePlaysound, pitchbend);
    resultDisplay.textContent = `playsound minecraft:block.note.harp master @a ~ ~ ~ 3 ${newPlaysound.toFixed(9)}`;
    
    // 履歴アイテムとコピー用ボタンを作成
    const historyItem = document.createElement("li");
    const commandText = `playsound minecraft:block.note.harp master @a ~ ~ ~ 3 ${newPlaysound.toFixed(9)}`;
    historyItem.textContent = commandText;

    // コピー用ボタン
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "コピー";
    copyBtn.className = "copy-btn";
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(commandText)
        .then(() => {
          copyBtn.textContent = "コピー済み";
          setTimeout(() => (copyBtn.textContent = "コピー"), 1500);
        })
        .catch(() => {
          alert("コピーに失敗しました");
        });
    });

    historyItem.appendChild(copyBtn);
    historyList.appendChild(historyItem);

    // 最大10件を維持
    if (historyList.children.length > 10) {
      historyList.removeChild(historyList.children[0]);
    }
  });

  clearHistoryButton.addEventListener("click", function () {
    historyList.innerHTML = "";
    resultDisplay.textContent = "ここに結果が表示されます";
  });
});
