window.onload = function () {
  let points = [];
  const canvasElement = document.getElementById("orbe");
  const context = canvasElement.getContext("2d");
  context.fillRect(0, 0, 400, 400);

  canvasElement.width = 400;
  canvasElement.height = 400;
  let MAX = 100;

  let ratio = 0;
  for (let i = 0; i < MAX; i++) {
    points.push([Math.cos(ratio), Math.sin(ratio), 0]);
    ratio += (Math.PI * 2) / MAX;
  }

  for (let i = 0; i < MAX; i++) {
    points.push([0, points[i][0], points[i][1]]);
  }

  for (let i = 0; i < MAX; i++) {
    points.push([0, points[i][1], points[i][0]]);
  }

  let angleY = 0;
  let angleX = 0;
  let angleZ = 0;
  innerAngleX = 0; // Puedes ajustar estas velocidades según tus necesidades
  innerAngleY = 0;
  innerAngleZ = 0;
  var vueltaCount = 0; // Contador de vueltas
  const distanceScale = .9; // Aumenta la distancia entre líneas

  function rus() {
    function rotatePoint(px, py, pz, angle, axis) {
      let cos = Math.cos(angle);
      let sin = Math.sin(angle);
      switch (axis) {
        case "X":
          return [px, cos * py - sin * pz, sin * py + cos * pz];
        case "Y":
          return [cos * px + sin * pz, py, -sin * px + cos * pz];
        case "Z":
          return [cos * px - sin * py, sin * px + cos * py, pz];
      }
    }    

    for (let i = 0; i < points.length - 1; i++) {
        function getRotatedCoordinates(index) {
          let [x, y, z] = points[index];

          let scaleFactor = index < points.length / 3 ? 0.5 : 1; // Escala del orbe interno vs externo
          for (let i = 0; i < 60; i++) {
            // Rotación del orbe alrededor de su propio eje
            [x, y, z] = rotatePoint(x, y, z, angleX, "X");
            [x, y, z] = rotatePoint(x, y, z, angleY, "Y");
            [x, y, z] = rotatePoint(x, y, z, angleZ, "Z");
            
        }        
        // Escala del orbe
        x *= scaleFactor;
        y *= scaleFactor;
        z *= scaleFactor;
        // Distancia entre líneas
        x *= distanceScale;
        y *= distanceScale;
        z *= distanceScale;        

          // Devolver los resultados
          return {
            x: x,
            y: y,
            z: z
          };
        }

        let vueltaCompletada = false;
        let start = getRotatedCoordinates(i);
        let end = getRotatedCoordinates((i + 1) % points.length);
        let phaseSegment = ((i % MAX) / MAX) * 10;
        let hue;
        let lightness;
        let opacity;

        if (phaseSegment < 2) {
          // Mantenerse en negro
          hue = 0;
          lightness = 0;
          opacity = 0.5;
        } else if (phaseSegment < 3) {
          // Transición de negro a amarillo
          hue = 60;
          lightness = (phaseSegment - 2) * 50;
          opacity = 0.02 + 0.09 * (1 - (phaseSegment - 2));
        } else if (phaseSegment < 5) {
          // Transición de amarillo a azul
          hue = 60 + (phaseSegment - 4) * 180;
          lightness = 50;
          opacity = 0.01 + 0.009 * (phaseSegment - 4);
        } else if (phaseSegment < 7) {
          // Azul puro
          hue = 260;
          lightness = 50;
          opacity = 0.04;
        } else {
          // Transición de azul a negro
          hue = 240;
          lightness = 50 - (phaseSegment - 6) * 25;
          opacity = 0.01 + 0.09 * (1 - (phaseSegment - 6) / 4);
        }
        context.strokeStyle = `hsla(${hue}, 100%, ${lightness}%, ${opacity})`;
        context.beginPath();
        context.moveTo(start.x* 200 + 200, start.y * 200 + 200, start.z*200+200);        
        context.lineTo(end.x * 200 + 200, end.y * 200 + 200, end.z *200 +200);
        context.stroke();
        // Incrementa el contador de vueltas si es la primera vuelta
        if (!vueltaCompletada) {
            vueltaCount++;
            vueltaCompletada = true;
            // Borra el canvas solo después de la primera vuelta
            if (vueltaCount === 300000) {
            context.clearRect(0, 0, canvasElement.width, canvasElement.height);
            vueltaCount = 0;
            }
        }
    }

    angleY += 0.01;
    angleX += 0.02;
    angleZ += 0.03;
    innerAngleX += 0.015; // Puedes ajustar estas velocidades según tus necesidades
    innerAngleY += 0.018;
    innerAngleZ += 0.02;

    requestAnimationFrame(rus);
  }

  rus();
};
