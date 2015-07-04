var PerlinSimplex = (function () {
    function PerlinSimplex() {
        this.F2 = 0.5 * (Math.sqrt(3) - 1);
        this.G2 = (3 - Math.sqrt(3)) / 6;
        this.G22 = 2 * this.G2 - 1;
        this.F3 = 1 / 3;
        this.G3 = 1 / 6;
        this.F4 = (Math.sqrt(5) - 1) / 4;
        this.G4 = (5 - Math.sqrt(5)) / 20;
        this.G42 = this.G4 * 2;
        this.G43 = this.G4 * 3;
        this.G44 = this.G4 * 4 - 1;
        this.aGrad3 = [
            [1, 1, 0],
            [-1, 1, 0],
            [1, -1, 0],
            [-1, -1, 0],
            [1, 0, 1],
            [-1, 0, 1],
            [1, 0, -1],
            [-1, 0, -1],
            [0, 1, 1],
            [0, -1, 1],
            [0, 1, -1],
            [0, -1, -1]
        ];
        this.grad4 = [
            [0, 1, 1, 1],
            [0, 1, 1, -1],
            [0, 1, -1, 1],
            [0, 1, -1, -1],
            [0, -1, 1, 1],
            [0, -1, 1, -1],
            [0, -1, -1, 1],
            [0, -1, -1, -1],
            [1, 0, 1, 1],
            [1, 0, 1, -1],
            [1, 0, -1, 1],
            [1, 0, -1, -1],
            [-1, 0, 1, 1],
            [-1, 0, 1, -1],
            [-1, 0, -1, 1],
            [-1, 0, -1, -1],
            [1, 1, 0, 1],
            [1, 1, 0, -1],
            [1, -1, 0, 1],
            [1, -1, 0, -1],
            [-1, 1, 0, 1],
            [-1, 1, 0, -1],
            [-1, -1, 0, 1],
            [-1, -1, 0, -1],
            [1, 1, 1, 0],
            [1, 1, -1, 0],
            [1, -1, 1, 0],
            [1, -1, -1, 0],
            [-1, 1, 1, 0],
            [-1, 1, -1, 0],
            [-1, -1, 1, 0],
            [-1, -1, -1, 0]
        ];
        this.simplex = [
            [0, 1, 2, 3],
            [0, 1, 3, 2],
            [0, 0, 0, 0],
            [0, 2, 3, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 2, 3, 0],
            [0, 2, 1, 3],
            [0, 0, 0, 0],
            [0, 3, 1, 2],
            [0, 3, 2, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 3, 2, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 2, 0, 3],
            [0, 0, 0, 0],
            [1, 3, 0, 2],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [2, 3, 0, 1],
            [2, 3, 1, 0],
            [1, 0, 2, 3],
            [1, 0, 3, 2],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [2, 0, 3, 1],
            [0, 0, 0, 0],
            [2, 1, 3, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [2, 0, 1, 3],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [3, 0, 1, 2],
            [3, 0, 2, 1],
            [0, 0, 0, 0],
            [3, 1, 2, 0],
            [2, 1, 0, 3],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [3, 1, 0, 2],
            [0, 0, 0, 0],
            [3, 2, 0, 1],
            [3, 2, 1, 0]
        ];
        this.oRng = Math;
        this.iOctaves = 1;
        this.fPersistence = 0.5;
        this.setPerm();
    }
    PerlinSimplex.prototype.octFreqPers = function () {
        var fFreq = 0;
        var fPers = 0;
        this.aOctFreq = [];
        this.aOctPers = [];
        var fPersMax = 0;
        for (var i = 0; i < this.iOctaves; i++) {
            fFreq = Math.pow(2, i);
            fPers = Math.pow(this.fPersistence, i);
            fPersMax += fPers;
            this.aOctFreq.push(fFreq);
            this.aOctPers.push(fPers);
        }
        this.fPersMax = 1 / this.fPersMax;
    };
    PerlinSimplex.prototype.dot1 = function (g, x) {
        return g[0] * x;
    };
    PerlinSimplex.prototype.dot2 = function (g, x, y) {
        return g[0] * x + g[1] * y;
    };
    PerlinSimplex.prototype.dot3 = function (g, x, y, z) {
        return g[0] * x + g[1] * y + g[2] * z;
    };
    PerlinSimplex.prototype.dot4 = function (g, x, y, z, w) {
        return g[0] * x + g[1] * y + g[2] * z + g[3] * w;
    };
    PerlinSimplex.prototype.setPerm = function () {
        var i;
        var p = [];
        for (i = 0; i < 256; i++) {
            p[i] = Math.floor(this.oRng.random() * 256);
        }
        this.aPerm = [];
        for (i = 0; i < 512; i++) {
            this.aPerm[i] = p[i & 255];
        }
    };
    PerlinSimplex.prototype.noise2d = function (x, y) {
        var g;
        var n0, n1, n2, n3, n4;
        var s;
        var c;
        var sc;
        var i, j, k, l;
        var t;
        var x0, y0, z0, w0;
        var i1, j1, k1, l1;
        var i2, j2, k2, l2;
        var i3, j3, k3, l3;
        var x1, y1, z1, w1;
        var x2, y2, z2, w2;
        var x3, y3, z3, w3;
        var x4, y4, z4, w4;
        var ii, jj, kk, ll;
        var gi0, gi1, gi2, gi3, gi4;
        var t0, t1, t2, t3, t4;
        s = (x + y) * this.F2;
        i = Math.floor(x + s);
        j = Math.floor(y + s);
        t = (i + j) * this.G2;
        x0 = x - (i - t);
        y0 = y - (j - t);
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        }
        else {
            i1 = 0;
            j1 = 1;
        }
        x1 = x0 - i1 + this.G2;
        y1 = y0 - j1 + this.G2;
        x2 = x0 + this.G22;
        y2 = y0 + this.G22;
        ii = i & 255;
        jj = j & 255;
        t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 < 0) {
            n0 = 0;
        }
        else {
            t0 *= t0;
            gi0 = this.aPerm[ii + this.aPerm[jj]] % 12;
            n0 = t0 * t0 * this.dot2(this.aGrad3[gi0], x0, y0);
        }
        t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0) {
            n1 = 0;
        }
        else {
            t1 *= t1;
            gi1 = this.aPerm[ii + i1 + this.aPerm[jj + j1]] % 12;
            n1 = t1 * t1 * this.dot2(this.aGrad3[gi1], x1, y1);
        }
        t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0) {
            n2 = 0;
        }
        else {
            t2 *= t2;
            gi2 = this.aPerm[ii + 1 + this.aPerm[jj + 1]] % 12;
            n2 = t2 * t2 * this.dot2(this.aGrad3[gi2], x2, y2);
        }
        return 70 * (n0 + n1 + n2);
    };
    PerlinSimplex.prototype.noise3d = function (x, y, z) {
        var g;
        var n0, n1, n2, n3, n4;
        var s;
        var c;
        var sc;
        var i, j, k, l;
        var t;
        var x0, y0, z0, w0;
        var i1, j1, k1, l1;
        var i2, j2, k2, l2;
        var i3, j3, k3, l3;
        var x1, y1, z1, w1;
        var x2, y2, z2, w2;
        var x3, y3, z3, w3;
        var x4, y4, z4, w4;
        var ii, jj, kk, ll;
        var gi0, gi1, gi2, gi3, gi4;
        var t0, t1, t2, t3, t4;
        s = (x + y + z) * this.F3;
        i = Math.floor(x + s);
        j = Math.floor(y + s);
        k = Math.floor(z + s);
        t = (i + j + k) * this.G3;
        x0 = x - (i - t);
        y0 = y - (j - t);
        z0 = z - (k - t);
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            }
            else if (x0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            }
            else {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            }
        }
        else {
            if (y0 < z0) {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            }
            else if (x0 < z0) {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            }
            else {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            }
        }
        x1 = x0 - i1 + this.G3;
        y1 = y0 - j1 + this.G3;
        z1 = z0 - k1 + this.G3;
        x2 = x0 - i2 + this.F3;
        y2 = y0 - j2 + this.F3;
        z2 = z0 - k2 + this.F3;
        x3 = x0 - 0.5;
        y3 = y0 - 0.5;
        z3 = z0 - 0.5;
        ii = i & 255;
        jj = j & 255;
        kk = k & 255;
        t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) {
            n0 = 0;
        }
        else {
            t0 *= t0;
            gi0 = this.aPerm[ii + this.aPerm[jj + this.aPerm[kk]]] % 12;
            n0 = t0 * t0 * this.dot3(this.aGrad3[gi0], x0, y0, z0);
        }
        t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) {
            n1 = 0;
        }
        else {
            t1 *= t1;
            gi1 = this.aPerm[ii + i1 + this.aPerm[jj + j1 + this.aPerm[kk + k1]]] % 12;
            n1 = t1 * t1 * this.dot3(this.aGrad3[gi1], x1, y1, z1);
        }
        t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) {
            n2 = 0;
        }
        else {
            t2 *= t2;
            gi2 = this.aPerm[ii + i2 + this.aPerm[jj + j2 + this.aPerm[kk + k2]]] % 12;
            n2 = t2 * t2 * this.dot3(this.aGrad3[gi2], x2, y2, z2);
        }
        t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) {
            n3 = 0;
        }
        else {
            t3 *= t3;
            gi3 = this.aPerm[ii + 1 + this.aPerm[jj + 1 + this.aPerm[kk + 1]]] % 12;
            n3 = t3 * t3 * this.dot3(this.aGrad3[gi3], x3, y3, z3);
        }
        return 32 * (n0 + n1 + n2 + n3);
    };
    PerlinSimplex.prototype.noise4d = function (x, y, z, w) {
        var g;
        var n0, n1, n2, n3, n4;
        var s;
        var c;
        var sc;
        var i, j, k, l;
        var t;
        var x0, y0, z0, w0;
        var i1, j1, k1, l1;
        var i2, j2, k2, l2;
        var i3, j3, k3, l3;
        var x1, y1, z1, w1;
        var x2, y2, z2, w2;
        var x3, y3, z3, w3;
        var x4, y4, z4, w4;
        var ii, jj, kk, ll;
        var gi0, gi1, gi2, gi3, gi4;
        var t0, t1, t2, t3, t4;
        s = (x + y + z + w) * this.F4;
        i = Math.floor(x + s);
        j = Math.floor(y + s);
        k = Math.floor(z + s);
        l = Math.floor(w + s);
        t = (i + j + k + l) * this.G4;
        x0 = x - (i - t);
        y0 = y - (j - t);
        z0 = z - (k - t);
        w0 = w - (l - t);
        c = 0;
        if (x0 > y0) {
            c = 0x20;
        }
        if (x0 > z0) {
            c |= 0x10;
        }
        if (y0 > z0) {
            c |= 0x08;
        }
        if (x0 > w0) {
            c |= 0x04;
        }
        if (y0 > w0) {
            c |= 0x02;
        }
        if (z0 > w0) {
            c |= 0x01;
        }
        sc = this.simplex[c];
        i1 = sc[0] >= 3 ? 1 : 0;
        j1 = sc[1] >= 3 ? 1 : 0;
        k1 = sc[2] >= 3 ? 1 : 0;
        l1 = sc[3] >= 3 ? 1 : 0;
        i2 = sc[0] >= 2 ? 1 : 0;
        j2 = sc[1] >= 2 ? 1 : 0;
        k2 = sc[2] >= 2 ? 1 : 0;
        l2 = sc[3] >= 2 ? 1 : 0;
        i3 = sc[0] >= 1 ? 1 : 0;
        j3 = sc[1] >= 1 ? 1 : 0;
        k3 = sc[2] >= 1 ? 1 : 0;
        l3 = sc[3] >= 1 ? 1 : 0;
        x1 = x0 - i1 + this.G4;
        y1 = y0 - j1 + this.G4;
        z1 = z0 - k1 + this.G4;
        w1 = w0 - l1 + this.G4;
        x2 = x0 - i2 + this.G42;
        y2 = y0 - j2 + this.G42;
        z2 = z0 - k2 + this.G42;
        w2 = w0 - l2 + this.G42;
        x3 = x0 - i3 + this.G43;
        y3 = y0 - j3 + this.G43;
        z3 = z0 - k3 + this.G43;
        w3 = w0 - l3 + this.G43;
        x4 = x0 + this.G44;
        y4 = y0 + this.G44;
        z4 = z0 + this.G44;
        w4 = w0 + this.G44;
        ii = i & 255;
        jj = j & 255;
        kk = k & 255;
        ll = l & 255;
        t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
        if (t0 < 0) {
            n0 = 0;
        }
        else {
            t0 *= t0;
            gi0 = this.aPerm[ii + this.aPerm[jj + this.aPerm[kk + this.aPerm[ll]]]] % 32;
            n0 = t0 * t0 * this.dot4(this.grad4[gi0], x0, y0, z0, w0);
        }
        t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
        if (t1 < 0) {
            n1 = 0;
        }
        else {
            t1 *= t1;
            gi1 = this.aPerm[ii + i1 + this.aPerm[jj + j1 + this.aPerm[kk + k1 + this.aPerm[ll + l1]]]] % 32;
            n1 = t1 * t1 * this.dot4(this.grad4[gi1], x1, y1, z1, w1);
        }
        t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
        if (t2 < 0) {
            n2 = 0;
        }
        else {
            t2 *= t2;
            gi2 = this.aPerm[ii + i2 + this.aPerm[jj + j2 + this.aPerm[kk + k2 + this.aPerm[ll + l2]]]] % 32;
            n2 = t2 * t2 * this.dot4(this.grad4[gi2], x2, y2, z2, w2);
        }
        t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
        if (t3 < 0) {
            n3 = 0;
        }
        else {
            t3 *= t3;
            gi3 = this.aPerm[ii + i3 + this.aPerm[jj + j3 + this.aPerm[kk + k3 + this.aPerm[ll + l3]]]] % 32;
            n3 = t3 * t3 * this.dot4(this.grad4[gi3], x3, y3, z3, w3);
        }
        t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
        if (t4 < 0) {
            n4 = 0;
        }
        else {
            t4 *= t4;
            gi4 = this.aPerm[ii + 1 + this.aPerm[jj + 1 + this.aPerm[kk + 1 + this.aPerm[ll + 1]]]] % 32;
            n4 = t4 * t4 * this.dot4(this.grad4[gi4], x4, y4, z4, w4);
        }
        return 27.0 * (n0 + n1 + n2 + n3 + n4);
    };
    PerlinSimplex.prototype.noise = function () {
        console.log(arguments);
        var x = arguments[0];
        var y = arguments[1];
        var z = arguments[2];
        var w = arguments[3];
        var fResult = 0;
        for (var g = 0; g < this.iOctaves; g++) {
            var fFreq = this.aOctFreq[g];
            var fPers = this.aOctPers[g];
            switch (arguments.length) {
                case 4:
                    fResult += fPers * this.noise4d(fFreq * x, fFreq * y, fFreq * z, fFreq * w);
                    break;
                case 3:
                    fResult += fPers * this.noise3d(fFreq * x, fFreq * y, fFreq * z);
                    break;
                default:
                    fResult += fPers * this.noise2d(fFreq * x, fFreq * y);
            }
        }
        return (fResult * this.fPersMax + 1) * 0.5;
    };
    PerlinSimplex.prototype.noiseDetail = function (octaves, falloff) {
        this.iOctaves = octaves || this.iOctaves;
        this.fPersistence = falloff || this.fPersistence;
        this.octFreqPers();
    };
    PerlinSimplex.prototype.setRng = function (r) {
        this.oRng = r;
        this.setPerm();
    };
    PerlinSimplex.prototype.toString = function () {
        return "[object PerlinSimplex " + this.iOctaves + " " + this.fPersistence + "]";
    };
    return PerlinSimplex;
})();
