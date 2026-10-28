import Phaser from 'phaser'

const WIDTH = 960
const HEIGHT = 620
const COLS = 11
const ROWS = 11
const TILE_WIDTH = 76
const TILE_HEIGHT = 38
const ORIGIN_X = WIDTH / 2
const ORIGIN_Y = 115

type Tile = { col: number; row: number }
type Position = { x: number; y: number }

// Isometric projection: converts a grid coordinate to a pixel position.
function toScreen(col: number, row: number): Position {
  return {
    x: ORIGIN_X + (col - row) * TILE_WIDTH / 2,
    y: ORIGIN_Y + (col + row) * TILE_HEIGHT / 2,
  }
}

// Inverse projection: converts a click back to a tile in the grid.
function toGrid(x: number, y: number): Tile {
  const dx = (x - ORIGIN_X) / (TILE_WIDTH / 2)
  const dy = (y - ORIGIN_Y) / (TILE_HEIGHT / 2)
  return {
    col: Math.round((dx + dy) / 2),
    row: Math.round((dy - dx) / 2),
  }
}

export class MilouScene extends Phaser.Scene {
  private milou!: Phaser.GameObjects.Container
  private readonly onActivity: (activity: string) => void

  constructor(onActivity: (activity: string) => void) {
    super({ key: 'MilouScene' })
    this.onActivity = onActivity
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#d9e9da')
    this.drawTerrain()
    this.drawDecorations()
    this.createMilou()

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const tile = toGrid(pointer.worldX, pointer.worldY)
      if (tile.col < 0 || tile.col >= COLS || tile.row < 0 || tile.row >= ROWS) return

      const target = toScreen(tile.col, tile.row)
      this.tweens.killTweensOf(this.milou)
      this.onActivity(`Περπατά προς το πλακίδιο (${tile.col}, ${tile.row})`)
      this.tweens.add({
        targets: this.milou,
        x: target.x,
        y: target.y,
        duration: 650,
        ease: 'Sine.easeInOut',
        onComplete: () => this.onActivity(`Εξερευνά το σημείο (${tile.col}, ${tile.row})`),
      })
    })
  }

  private drawDiamond(x: number, y: number, color: number): void {
    const shape = this.add.graphics()
    shape.fillStyle(color)
    shape.fillPoints([
      new Phaser.Math.Vector2(x, y - TILE_HEIGHT / 2),
      new Phaser.Math.Vector2(x + TILE_WIDTH / 2, y),
      new Phaser.Math.Vector2(x, y + TILE_HEIGHT / 2),
      new Phaser.Math.Vector2(x - TILE_WIDTH / 2, y),
    ], true)
    shape.lineStyle(1, 0xffffff, 0.25)
    shape.strokePoints([
      new Phaser.Math.Vector2(x, y - TILE_HEIGHT / 2),
      new Phaser.Math.Vector2(x + TILE_WIDTH / 2, y),
      new Phaser.Math.Vector2(x, y + TILE_HEIGHT / 2),
      new Phaser.Math.Vector2(x - TILE_WIDTH / 2, y),
    ], true)
  }

  private drawTerrain(): void {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const { x, y } = toScreen(col, row)
        const isPond = col >= 8 && row <= 2
        const isPath = row === 5 || col === 5
        const grass = (col + row) % 2 ? 0xa8cfa9 : 0x9cc6a2
        const color = isPond ? 0x83c8cc : isPath ? 0xead8bb : grass
        this.drawDiamond(x, y, color)
      }
    }
  }

  private drawDecorations(): void {
    const treeTiles: Tile[] = [
      { col: 1, row: 2 }, { col: 0, row: 6 }, { col: 2, row: 9 },
      { col: 9, row: 5 }, { col: 10, row: 8 }, { col: 7, row: 9 },
    ]
    for (const tile of treeTiles) {
      const { x, y } = toScreen(tile.col, tile.row)
      const tree = this.add.graphics()
      tree.fillStyle(0x806e56)
      tree.fillRoundedRect(x - 5, y - 43, 10, 37, 3)
      tree.fillStyle(0x6ea987)
      tree.fillCircle(x, y - 50, 24)
      tree.fillStyle(0x8dc39b)
      tree.fillCircle(x - 10, y - 57, 16)
    }

    this.drawBuilding(3, 3, 0xf0b98a, 'MILOU’S HOME')
    this.drawBuilding(7, 6, 0x89b8dc, 'CODING LAB')
    this.drawBuilding(3, 8, 0xd6a4c5, 'ART STUDIO')
  }

  private drawBuilding(col: number, row: number, color: number, name: string): void {
    const { x, y } = toScreen(col, row)
    const building = this.add.graphics()
    building.fillStyle(color)
    building.fillRoundedRect(x - 29, y - 68, 58, 62, 6)
    building.fillStyle(0x7e706f)
    building.fillTriangle(x - 39, y - 67, x, y - 106, x + 39, y - 67)
    building.fillStyle(0xf8e2ac)
    building.fillRoundedRect(x - 8, y - 36, 16, 30, 3)
    building.fillStyle(0xdff5f4)
    building.fillRoundedRect(x - 23, y - 58, 13, 15, 2)
    this.add.text(x, y - 126, name, {
      fontFamily: 'Arial, sans-serif', fontSize: '13px',
      color: '#29493c', backgroundColor: '#ffffff',
      padding: { x: 7, y: 4 },
    }).setOrigin(0.5)
  }

  private createMilou(): void {
    const { x, y } = toScreen(5, 5)
    const body = this.add.graphics()
    body.fillStyle(0x436d59, 0.25)
    body.fillEllipse(0, 4, 42, 15)
    body.fillStyle(0xf6dfbd)
    body.fillCircle(0, -22, 25)
    body.fillStyle(0x292d31)
    body.fillCircle(-9, -25, 3)
    body.fillCircle(9, -25, 3)
    body.fillStyle(0xf0a98c)
    body.fillTriangle(-5, -14, 5, -14, 0, -8)
    const name = this.add.text(0, -65, 'Milou', {
      fontFamily: 'Arial, sans-serif', fontSize: '18px',
      color: '#214b3e', backgroundColor: '#ffffff',
      padding: { x: 9, y: 4 },
    }).setOrigin(0.5)
    this.milou = this.add.container(x, y, [body, name]).setDepth(100)
    this.tweens.add({ targets: body, y: -3, duration: 850, yoyo: true, repeat: -1 })
  }
}
